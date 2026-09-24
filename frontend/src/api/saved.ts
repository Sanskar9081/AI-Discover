import client from './client';

export const savedAPI = {
  getSavedItems: () => client.get('/saved'),
  saveItem: (data: any) => client.post('/saved', data),
  deleteSavedItem: (id: string) => client.delete(`/saved/${id}`),
};
