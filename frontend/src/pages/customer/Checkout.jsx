import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cart.service';
import { orderService } from '../../services/order.service';
import Loader from '../../components/common/Loader';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Load cart summary
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  // Checkout submission mutation
  const checkoutMutation = useMutation({
    mutationFn: () => orderService.checkout(),
    onSuccess: (order) => {
      // Invalidate queries so that the navbar cart count and active cart state refreshes immediately (cart is cleared)
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Checkout failed');
    },
  });

  if (isLoading) return <Loader message="Preparing checkout summary..." />;

  // Redirect if cart is empty and checkout hasn't succeeded
  if ((!cart || cart.items.length === 0) && !checkoutMutation.isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center font-sans">
        <h3 className="text-lg font-bold text-gray-700">No items to checkout</h3>
        <button onClick={() => navigate('/products')} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition cursor-pointer">
          Browse products
        </button>
      </div>
    );
  }

  // Display success page
  if (checkoutMutation.isSuccess) {
    const successData = checkoutMutation.data;
    return (
      <div className="max-w-lg mx-auto px-4 py-12 font-sans">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center space-y-6">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
            <CheckCircle size={36} className="fill-emerald-50 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-850">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">Thank you for supporting local growers.</p>
          </div>
          <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-2 text-sm font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Order ID</span>
              <span className="font-bold text-gray-850 break-all pl-4 text-right">{successData.id}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Total Price</span>
              <span className="font-extrabold text-emerald-800">₹{parseFloat(successData.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Order Status</span>
              <span className="font-bold text-green-700 uppercase tracking-wider text-xs bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">{successData.status}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition tracking-wide text-sm cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Back to cart link */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-700 mb-8 transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Return to Cart</span>
      </button>

      <h2 className="text-2xl font-extrabold text-gray-850 tracking-tight mb-8">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Order review list */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-md border-b border-gray-50 pb-3">Review Items</h3>
          <div className="divide-y divide-gray-150/60 max-h-[400px] overflow-y-auto pr-2">
            {cart.items.map((item) => (
              <div key={item.product_id} className="py-4 flex justify-between items-center text-sm font-semibold">
                <div className="flex flex-col">
                  <span className="text-gray-800">{item.product_name}</span>
                  <span className="text-xs text-gray-400 mt-1">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</span>
                </div>
                <span className="text-gray-900 font-extrabold">₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing calculations and actions */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-800 text-md border-b border-gray-50 pb-3">Summary</h3>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between text-gray-500">
              <span>Total Items</span>
              <span className="font-semibold text-gray-800">{cart.total_items} items</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-gray-50">
              <span className="font-bold text-gray-700">Grand Total</span>
              <span className="text-2xl font-black text-emerald-800">₹{cart.grand_total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {checkoutMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}