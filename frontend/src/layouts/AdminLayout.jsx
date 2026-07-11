import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, LayoutDashboard, ShoppingBag, PlusCircle } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-800 text-white flex flex-col shadow-md">
        <div className="p-5 border-b border-emerald-700 flex items-center gap-2">
          <span className="text-xl font-bold tracking-wide">🌾 Farmer Admin</span>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-700 transition">
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-700 transition">
            <ShoppingBag size={18} />
            <span className="font-medium text-sm">Manage Products</span>
          </Link>
          <Link to="/admin/products/add" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-700 transition">
            <PlusCircle size={18} />
            <span className="font-medium text-sm">Add Product</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-700 transition">
            <Home size={18} />
            <span className="font-medium text-sm">Customer View</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-emerald-700">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition text-red-100 hover:text-white">
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Admin Control Panel</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Logged in as Admin</span>
          </div>
        </header>
        <main className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
