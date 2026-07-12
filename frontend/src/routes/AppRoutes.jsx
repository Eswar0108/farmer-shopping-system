import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import CustomerProtectedRoute from '../components/common/CustomerProtectedRoute';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Home from '../pages/customer/Home';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import CustomerLogin from '../pages/customer/Login';
import CustomerRegister from '../pages/customer/Register';
import Orders from '../pages/customer/Orders';

import AdminLogin from '../pages/admin/Login';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AddProduct from '../pages/admin/AddProduct';
import EditProduct from '../pages/admin/EditProduct';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes with Layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
        
        {/* Protected Customer Routes */}
        <Route
          path="/cart"
          element={
            <CustomerProtectedRoute>
              <Cart />
            </CustomerProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerProtectedRoute>
              <Checkout />
            </CustomerProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <CustomerProtectedRoute>
              <Orders />
            </CustomerProtectedRoute>
          }
        />
      </Route>

      {/* Admin Routes - Login is outside Sidebar */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes with Sidebar Layout */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/:id" element={<EditProduct />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}