'use client';

import { useState, useEffect, useRef } from 'react';

// 将文本内容转换为支持换行的JSX
function formatMessage(content: string) {
  return content.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i !== content.split('\n').length - 1 && <br />}
    </span>
  ));
}

// 生成进度指示器组件
function LoadingIndicator({ progress }: { progress: number }) {
  return (
    <div className="loading-container">
      <div className="loading-icon">
        <div className="loading-circle" />
        <div className="loading-inner" />
        <svg className="loading-star" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 1L9 9H1L7 14L5 22L12 17L19 22L17 14L23 9H15L12 1Z"
          />
        </svg>
      </div>
      <div className="text-center">
        <div className="generating-text">Generating your response...</div>
        <div className="loading-progress">{progress}% completed</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([
    {
      type: 'ai',
      content: '啊哈！又一位求知若渴的朋友来访。\n\n让我们开始一段妙趣横生的对话吧。正如马克吐温所说："真正的智慧，是与幽默并存的。"\n\n说吧，什么问题让你如此困扰？'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      const scrollArea = chatScrollAreaRef.current;
      const scrollHeight = scrollArea.scrollHeight;
      const height = scrollArea.clientHeight;
      const maxScroll = scrollHeight - height;
      
      scrollArea.scrollTo({
        top: maxScroll + 100,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = windowHeight * 0.2;

      if (heroRef.current) {
        const scrolled = scrollPosition > scrollThreshold;
        setIsChatVisible(scrolled);
        heroRef.current.classList.toggle('scrolled', scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 清理进度条定时器
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const handleScrollDown = () => {
    const targetScroll = window.innerHeight * 0.3;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const simulateProgress = () => {
    setProgress(0);
    let currentProgress = 0;
    
    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) {
        currentProgress = 100;
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
      setProgress(Math.min(Math.round(currentProgress), 100));
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    simulateProgress();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('API请求失败');
      }

      const data = await response.json();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        setProgress(100);
      }
      setMessages(prev => [...prev, { type: 'ai', content: data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: '哎呀！看来是出了点技术故障。不过就像鲁迅先生说的："困难是一定有的，问题是要解决它。"\n\n让我们稍后再试吧。' 
      }]);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <main className="main-container">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="flex items-center space-x-8">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"/>
            </svg>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="nav-link">功能</a>
              <a href="#" className="nav-link">关于</a>
              <a href="#" className="nav-link">文档</a>
              <a href="#" className="nav-link">支持</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="nav-link">登录</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            文豪 <span className="gradient-text">AI</span>
          </h1>
          <p className="hero-subtitle">
            碾磨的薄，锋利的思维
          </p>
        </div>
        <button onClick={handleScrollDown} className="scroll-indicator">
          <span>开始对话</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* Chat Interface */}
      <div className={`chat-interface ${isChatVisible ? 'visible' : ''}`}>
        <div className="content-area">
          <section className="chat-section">
            <div className="chat-scroll-area" ref={chatScrollAreaRef}>
              <div className="chat-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'} whitespace-pre-wrap new-message`}
                  >
                    <div className="message-glow" />
                    {formatMessage(message.content)}
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai-message new-message">
                    <div className="message-glow" />
                    <LoadingIndicator progress={progress} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </section>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题，让我们开始一段妙趣横生的对话..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || isLoading}
            >
              发送
            </button>
          </div>
        </form>
        </div>

      {/* Spacer for scrolling */}
      <div style={{ height: '200vh' }} />
      </main>
  );
}
