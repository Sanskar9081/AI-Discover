import client from './client';

export const promptsAPI = {
  getPrompts: () => client.get('/prompts'),
  getPromptById: (id: string) => client.get(`/prompts/${id}`),
};
