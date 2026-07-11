import api from '../api/axios';

export const productService = {
  getProducts: async ({ page = 1, limit = 12, search, categoryId, isActive } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (categoryId) params.category_id = categoryId;
    if (isActive !== undefined) params.is_active = isActive;
    
    const res = await api.get('/products', { params });
    return res.data;
  },

  getProduct: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  createProduct: async (data) => {
    const res = await api.post('/products', data);
    return res.data;
  },

  updateProduct: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  updateStatus: async (id, isActive) => {
    const res = await api.patch(`/products/${id}/status`, { is_active: isActive });
    return res.data;
  },

  updateStock: async (id, availableQuantity) => {
    const res = await api.patch(`/products/${id}/stock`, { available_quantity: availableQuantity });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },

  createCategory: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  }
};
