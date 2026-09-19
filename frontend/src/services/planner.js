import { api } from './api.js';

function crud(resource, singleKey, listKey) {
  return {
    list: async (params) => {
      const res = await api.get(`/${resource}`, { params });
      return res.data[listKey];
    },
    create: async (data) => {
      const res = await api.post(`/${resource}`, data);
      return res.data[singleKey];
    },
    update: async (id, data) => {
      const res = await api.put(`/${resource}/${id}`, data);
      return res.data[singleKey];
    },
    remove: async (id) => {
      await api.delete(`/${resource}/${id}`);
    },
  };
}

export const plannerApi = {
  subjects: crud('subjects', 'subject', 'subjects'),
  assignments: crud('assignments', 'assignment', 'assignments'),
  exams: crud('exams', 'exam', 'exams'),
  attendance: {
    ...crud('attendance', 'attendance', 'attendance'),
    record: async (id, present) => {
      const res = await api.post(`/attendance/${id}/record`, { present });
      return res.data.attendance;
    },
  },
};