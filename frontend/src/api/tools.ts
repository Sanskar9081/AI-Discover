import client from './client';

export const toolsAPI = {
  getTools: (params?: any) => client.get('/tools', { params }),
  getToolById: (id: string) => client.get(`/tools/${id}`),
  createTool: (data: any) => client.post('/tools', data),
  updateTool: (id: string, data: any) => client.patch(`/tools/${id}`, data),
  deleteTool: (id: string) => client.delete(`/tools/${id}`),
};
