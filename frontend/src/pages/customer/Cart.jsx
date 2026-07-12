import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../services/cart.service';
import CartItem from '../../components/customer/CartItem';
import Loader from '../../components/common/Loader';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get cart items
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  // Quantity modification mutation
  const updateQtyMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to update quantity');
    },
  });

  // Item deletion mutation
  const deleteItemMutation = useMutation({
    mutationFn: (productId) => cartService.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to remove item');
    },
  });

  const handleQuantityChange = (productId, newQty) => {
    updateQtyMutation.mutate({ productId, quantity: newQty });
  };

  const handleRemove = (productId) => {
    deleteItemMutation.mutate(productId);
  };

  if (isLoading) return <Loader message="Reviewing shopping bag..." />;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <h2 className="text-2xl font-extrabold text-gray-850 tracking-tight mb-8">Shopping Cart</h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-3xl shadow-sm space-y-5">
          <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mt-1">Looks like you haven't added any fresh harvest items yet.</p>
          </div>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm hover:shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {cart.items.map((item) => (
              <CartItem
                key={item.product_id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Cart summary box */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-gray-800 text-md border-b border-gray-100 pb-3">Order Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500 font-semibold">
                <span>Total Items</span>
                <span>{cart.total_items} items</span>
              </div>
              
              {cart.items.some(item => item.discount_amount > 0) && (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-500 font-semibold pt-1">
                    <span>Original Price</span>
                    <span className="line-through">₹{(cart.grand_total + cart.items.reduce((acc, item) => acc + (item.discount_amount * item.quantity), 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-amber-600 font-bold pt-1">
                    <span>Discount Savings</span>
                    <span>-₹{cart.items.reduce((acc, item) => acc + (item.discount_amount * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="flex items-baseline justify-between pt-3 border-t border-gray-50">
                <span className="text-sm font-bold text-gray-700">Subtotal</span>
                <span className="text-xl font-extrabold text-emerald-800">₹{cart.grand_total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition tracking-wide text-sm cursor-pointer"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-700 transition py-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}