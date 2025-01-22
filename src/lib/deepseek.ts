import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

// 创建OpenAI客户端实例
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

// 默认的聊天参数
export const defaultChatConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
}; 