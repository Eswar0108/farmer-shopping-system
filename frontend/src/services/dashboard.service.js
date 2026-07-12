import api from '../api/axios';

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  }
};
