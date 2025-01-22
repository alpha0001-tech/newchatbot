import OpenAI from 'openai';

// 默认的聊天参数
export const defaultChatConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
};

// 创建OpenAI客户端实例的函数
export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

// 运行时检查环境变量
export function checkEnvironmentVariables() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }
  return true;
} 