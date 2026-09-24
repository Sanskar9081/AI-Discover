import client from './client';

export const assistantAPI = {
  chat: async (messages: any[]) => {
    const data: any = await client.post('/assistant/chat', { messages });
    return data;
  }
};
