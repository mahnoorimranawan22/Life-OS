import { api } from './api.js';

export const taskApi = {
  list: async (params) => {
    const res = await api.get('/tasks', { params });
    return res.data.tasks;
  },
  create: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data.task;
  },
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data.task;
  },
  remove: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};