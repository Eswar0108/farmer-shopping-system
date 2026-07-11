import api from '../api/axios';

export const cartService = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data;
  },

  addToCart: async (productId, quantity) => {
    const res = await api.post('/cart/items', { product_id: productId, quantity });
    return res.data;
  },

  updateCartItem: async (productId, quantity) => {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    return res.data;
  },

  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    return res.data;
  }
};
