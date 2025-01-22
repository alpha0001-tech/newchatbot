import OpenAI from 'openai';

// 创建OpenAI客户端实例
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
  baseURL: 'https://api.deepseek.com/v1',
});

// 默认的聊天参数
export const defaultChatConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
};

// 运行时检查环境变量
export function checkEnvironmentVariables() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }
  return true;
} 