import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-gray-100 last:border-b-0 gap-4">
      {/* Product Information */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.product_image_url ? (
            <img src={item.product_image_url} alt={item.product_name} className="object-cover h-full w-full" />
          ) : (
            <span className="text-2xl select-none">🌾</span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm sm:text-base">{item.product_name}</h4>
          <span className="text-xs font-semibold text-gray-400 mt-1 block">₹{item.price.toFixed(2)} each</span>
        </div>
      </div>

      {/* Item controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
        <QuantitySelector
          quantity={item.quantity}
          max={item.max_stock}
          onChange={(newQty) => onQuantityChange(item.product_id, newQty)}
        />
        <div className="text-right flex items-center gap-4">
          <span className="text-md font-extrabold text-gray-900 min-w-[70px]">
            ₹{item.subtotal.toFixed(2)}
          </span>
          <button
            onClick={() => onRemove(item.product_id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
