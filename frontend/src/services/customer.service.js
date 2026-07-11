import api from '../api/axios';

export const customerService = {
  register: async (name, email, password) => {
    const res = await api.post('/customer/auth/register', { name, email, password });
    return res.data;
  },
  login: async (email, password) => {
    const res = await api.post('/customer/auth/login', { email, password });
    return res.data;
  }
};
