import OpenAI from 'openai';

// 创建OpenAI客户端实例
export const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

// 默认的聊天参数
export const defaultChatConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
}; 