import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { cartService } from '../../services/cart.service';
import QuantitySelector from '../../components/customer/QuantitySelector';
import Loader from '../../components/common/Loader';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isCustomerAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState(null);

  // Fetch product detail
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    onError: () => navigate('/products'),
  });

  // Cart addition mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setFeedback({ type: 'success', message: `Added ${quantity} item(s) to your cart!` });
      setTimeout(() => setFeedback(null), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to add item to cart',
      });
      setTimeout(() => setFeedback(null), 4000);
    },
  });

  const handleAddToCart = () => {
    if (!isCustomerAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product || !product.is_active || product.available_quantity <= 0) return;
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  if (isLoading) return <Loader message="Gathering farm details..." />;
  if (!product) return null;

  const isOutOfStock = product.available_quantity <= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      {/* Back to list link */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-700 mb-8 transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </button>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <span className="text-6xl select-none">🌾</span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-100 text-red-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Meta / Purchasing Controls */}
        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            {product.category && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-850 tracking-tight leading-tight">
              {product.name}
            </h2>
            <p className="text-sm font-medium text-gray-400">Harvested by <span className="text-gray-600 font-semibold">{product.farmer_name}</span></p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">₹{product.price.toFixed(2)}</span>
            </div>
            {product.description && (
              <p className="text-sm leading-relaxed text-gray-500 font-medium pt-2 border-t border-gray-50">
                {product.description}
              </p>
            )}
          </div>

          {/* Purchasing Controls */}
          <div className="mt-8 pt-6 border-t border-gray-150/70 space-y-4">
            {product.is_active && !isOutOfStock ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-600">Select Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    max={product.available_quantity}
                    onChange={setQuantity}
                  />
                  <span className="text-xs text-gray-400 font-semibold">
                    ({product.available_quantity} in stock)
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed tracking-wide cursor-pointer"
                >
                  {addToCartMutation.isPending ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                <p className="text-sm font-bold text-gray-500">
                  {!product.is_active ? 'This product is currently inactive.' : 'Out of Stock'}
                </p>
              </div>
            )}

            {/* Notification/Feedback banner */}
            {feedback && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in duration-200 ${
                feedback.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-xs font-bold leading-none">{feedback.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
