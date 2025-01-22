import OpenAI from 'openai';

// 默认的聊天参数
export const defaultChatConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 1000,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
};

/**
 * 创建OpenAI客户端实例的函数
 * 这个函数在运行时创建客户端，而不是在构建时，
 * 这样可以避免在构建过程中因缺少环境变量而失败
 */
export function createOpenAIClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
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