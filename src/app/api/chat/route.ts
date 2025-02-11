import { NextResponse } from 'next/server';
import { defaultChatConfig, createOpenAIClient } from '@/lib/deepseek';
import OpenAI from 'openai';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const SYSTEM_PROMPT = `你是一位充满智慧与幽默的AI助手，继承了鲁迅的辛辣讽刺、马克吐温的幽默风趣。
在回答时请注意：
1. 用优雅而不失锋芒的语言，时而讽刺时而幽默
2. 观点要鞭辟入里，一针见血
3. 适当运用比喻和修辞，让语言更生动
4. 每个不同的观点或论述要分段表达
5. 重要的观点可以适当使用引号强调
6. 在合适的时候可以引用一些经典名言或者俗语

记住：要像文学大师一样优雅而不失力度，幽默而不失深度。`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: Message[] };

    // 创建OpenAI客户端实例
    const openai = createOpenAIClient();

    const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      } as OpenAI.Chat.ChatCompletionMessageParam)),
    ];

    const response = await openai.chat.completions.create({
      ...defaultChatConfig,
      messages: apiMessages,
    });

    // 获取AI的回复并进行格式化
    let content = response.choices[0]?.message?.content || '抱歉，我现在无法回答这个问题。';
    
    // 确保段落之间有适当的空行
    content = content.replace(/([。！？\n])\s*(?=\S)/g, '$1\n\n');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // 改进错误处理
    const errorMessage = error instanceof Error 
      ? (error.message === 'Missing DEEPSEEK_API_KEY environment variable' 
        ? '未设置 Deepseek API 密钥，请检查环境变量配置' 
        : error.message)
      : '处理请求时发生错误';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 