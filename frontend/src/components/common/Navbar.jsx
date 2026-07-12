import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, LogIn, LogOut, LayoutDashboard, Leaf } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../../services/cart.service';

export default function Navbar() {
  const {
    isAuthenticated,
    logout,
    customerUser,
    isCustomerAuthenticated,
    customerLogout,
  } = useAuth();
  const navigate = useNavigate();

  // Get cart status to display total items badge - only enabled if logged in
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isCustomerAuthenticated,
    refetchInterval: isCustomerAuthenticated ? 5000 : false, // Poll every 5s to keep cart count updated
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleCustomerLogout = () => {
    customerLogout();
    navigate('/login');
  };

  const totalItems = cart?.total_items || 0;

  return (
    <nav className="sticky top-0 z-50 bg-emerald-800 border-b border-emerald-700 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <Leaf className="text-emerald-300 fill-emerald-300" size={24} />
            <span className="text-xl font-bold tracking-tight text-white">Farmer Shop</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="text-emerald-100 hover:text-white font-medium text-sm transition">
              Products
            </Link>

            {isCustomerAuthenticated && (
              <Link to="/orders" className="text-emerald-100 hover:text-white font-medium text-sm transition">
                My Orders
              </Link>
            )}
            
            <Link to="/cart" className="relative flex items-center p-2 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-700 transition">
              <ShoppingCart size={20} />
              {isCustomerAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 font-bold text-xs h-5 w-5 rounded-full flex items-center justify-center border-2 border-emerald-800">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-emerald-700 pl-4">
                <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-emerald-100 hover:text-white font-medium text-sm transition">
                  <LayoutDashboard size={16} />
                  <span>Admin</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-emerald-900 border border-emerald-700 text-emerald-100 hover:text-white hover:bg-red-700 hover:border-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : isCustomerAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-emerald-700 pl-4">
                <span className="text-emerald-100 font-semibold text-sm">
                  Hi, {customerUser?.name || 'Customer'}
                </span>
                <button onClick={handleCustomerLogout} className="flex items-center gap-1 bg-emerald-950 border border-emerald-700 text-emerald-100 hover:text-white hover:bg-red-700 hover:border-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-emerald-700 pl-4">
                <Link to="/login" className="flex items-center gap-1.5 text-emerald-100 hover:text-white font-medium text-sm transition">
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link to="/admin/login" className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition">
                  <LogIn size={14} />
                  <span>Admin Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}