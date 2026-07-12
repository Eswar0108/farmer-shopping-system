import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Package, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Orders() {
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => orderService.getOrders(),
  });

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (isLoading) return <Loader message="Loading order history..." />;

  const orders = orderData?.items || [];

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={Package}
          title="No orders found"
          description="You haven't placed any orders yet. Visit the catalog to find fresh farm items!"
          actionLabel="Browse Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">My Orders</h2>
        <p className="text-sm text-gray-500 mt-1">View your past orders, items purchased, and shipment details.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition">
              {/* Header Box */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/55 transition select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold uppercase tracking-wide">
                      {order.status}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono truncate max-w-[150px] sm:max-w-none">
                      ID: {order.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Spent</p>
                    <p className="text-lg font-extrabold text-emerald-800">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div className="text-gray-400 hover:text-emerald-700 transition">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {/* Items Section (Expanded) */}
              {isExpanded && (
                <div className="border-t border-gray-150 bg-gray-50/20 p-4 sm:p-5 space-y-4">
                  <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 text-lg">
                            🌾
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-gray-800">{item.product_name || 'Harvest Item'}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-700">₹{item.subtotal.toFixed(2)}</p>
                          <p className="text-[9px] text-gray-400 font-medium mt-0.5">₹{item.unit_price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
