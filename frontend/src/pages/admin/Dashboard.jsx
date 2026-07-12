import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';
import DashboardCard from '../../components/admin/DashboardCard';
import Loader from '../../components/common/Loader';
import { ShoppingBag, CheckCircle, PackageOpen, Layers, IndianRupee, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  // Fetch real-time dashboard analytics metrics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  if (isLoading) {
    return <Loader message="Analyzing database metrics in real-time..." />;
  }

  if (!stats) {
    return (
      <div className="p-8 text-center text-gray-500 font-bold">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h2>
        <p className="text-xs text-gray-400 mt-1 font-semibold">Real-time database statistics and agricultural inventory controls.</p>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={`₹${stats.total_revenue.toFixed(2)}`}
          icon={IndianRupee}
          color="emerald"
        />
        <DashboardCard
          title="Total Products"
          value={stats.total_products}
          icon={ShoppingBag}
          color="blue"
        />
        <DashboardCard
          title="Active Catalog"
          value={`${stats.active_products} Active`}
          icon={CheckCircle}
          color="blue"
        />
        <DashboardCard
          title="Total Stock"
          value={`${stats.total_inventory} Units`}
          icon={PackageOpen}
          color="amber"
        />
      </div>

      {/* Warning and activity split rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Warnings */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-bold border-b border-gray-100 pb-3">
            <AlertTriangle size={18} />
            <h3 className="text-gray-800 text-md">Low Stock Warnings</h3>
          </div>
          {stats.low_stock_products.length === 0 ? (
            <div className="p-4 bg-green-50 text-green-700 text-xs font-semibold rounded-2xl border border-green-150 text-center">
              ✅ All inventory levels are optimal.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-2">
              {stats.low_stock_products.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-gray-800">{p.name}</h4>
                    <span className="text-gray-400 font-medium">Price: ₹{p.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg text-[10px]">
                      {p.available_quantity} left
                    </span>
                    <Link
                      to="/admin/products"
                      className="px-2.5 py-1 hover:bg-emerald-50 text-emerald-700 hover:border-emerald-600 border border-gray-200 rounded-lg font-bold transition text-[10px]"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customer Orders */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-gray-100 pb-3">
            <ShoppingBag size={18} />
            <h3 className="text-gray-800 text-md">Recent Customer Orders</h3>
          </div>
          {stats.recent_orders.length === 0 ? (
            <div className="p-4 bg-gray-50 text-gray-500 text-xs font-semibold rounded-2xl text-center">
              No recent orders placed yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-2">
              {stats.recent_orders.map((o) => (
                <div key={o.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-gray-800 truncate max-w-[180px]" title={o.customer_email}>{o.customer_email}</h4>
                    <span className="text-gray-400 flex items-center gap-1 mt-0.5 font-medium">
                      <Calendar size={10} />
                      {new Date(o.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-800">₹{o.total.toFixed(2)}</p>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-green-50 text-green-700 font-bold uppercase tracking-wider text-[8px] rounded-full border border-green-200">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products by Category distribution */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-gray-800 text-md">Products by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(stats.category_distribution || {}).map(([catName, count]) => {
            const percentage = stats.total_products > 0 ? (count / stats.total_products) * 100 : 0;
            return (
              <div key={catName} className="space-y-2 border border-gray-100 p-4 rounded-2xl bg-gray-50/30">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                  <span>{catName}</span>
                  <span className="text-emerald-700 font-bold">{count} items</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}