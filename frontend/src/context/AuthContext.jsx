import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { customerService } from '../services/customer.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Admin states
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Customer states
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('customer_token'));
  const [customerUser, setCustomerUser] = useState(() => {
    const stored = localStorage.getItem('customer_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Admin handlers
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('admin_token', data.access_token);
    setToken(data.access_token);
    setUser({ email });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  }, []);

  // Customer handlers
  const customerLogin = useCallback(async (email, password) => {
    const data = await customerService.login(email, password);
    localStorage.setItem('customer_token', data.access_token);
    localStorage.setItem('customer_user', JSON.stringify(data.customer));
    setCustomerToken(data.access_token);
    setCustomerUser(data.customer);
    return data;
  }, []);

  const customerRegister = useCallback(async (name, email, password) => {
    return await customerService.register(name, email, password);
  }, []);

  const customerLogout = useCallback(() => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setCustomerToken(null);
    setCustomerUser(null);
  }, []);

  const isAuthenticated = !!token;
  const isCustomerAuthenticated = !!customerToken;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        customerToken,
        customerUser,
        isCustomerAuthenticated,
        customerLogin,
        customerRegister,
        customerLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}