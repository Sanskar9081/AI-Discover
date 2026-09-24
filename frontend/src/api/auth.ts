import client from './client';

export const authAPI = {
  register: (data: any) => client.post('/auth/register', data),
  login: (data: any) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
  getCurrentUser: () => client.get('/auth/me'),
};
