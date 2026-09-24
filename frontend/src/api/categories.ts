import client from './client';

export const categoriesAPI = {
  getCategories: () => client.get('/categories'),
};
