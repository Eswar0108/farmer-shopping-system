import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Leaf, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function CustomerLogin() {
  const { customerLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await customerLogin(data.email, data.password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <Leaf size={24} className="text-emerald-300" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Sign In</h2>
        <p className="text-sm text-gray-500 font-semibold">Sign in to check out your shopping cart</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 shadow-md sm:rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 animate-in fade-in duration-200">
              <AlertCircle size={18} />
              <span className="text-xs font-bold leading-none">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
              />
              {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <input
                type="password"
                {...register('password')}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
              />
              {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-sm text-gray-400 font-medium">Don't have an account? </span>
            <Link to="/register" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
