import api from '../api/axios';

export const aiService = {
  describeProduct: async ({ name, price, category, farmer_name }) => {
    const res = await api.post('/admin/ai/describe', {
      name,
      price: parseFloat(price),
      category,
      farmer_name
    });
    return res.data;
  },

  suggestPrice: async ({ name, category }) => {
    const res = await api.post('/admin/ai/suggest-price', {
      product_name: name,
      category
    });
    return res.data;
  },

  chat: async (message) => {
    const res = await api.post('/ai/chat', { message });
    return res.data;
  }
};
