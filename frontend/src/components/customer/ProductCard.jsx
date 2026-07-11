import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const isOutOfStock = product.available_quantity <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col h-full"
    >
      {/* Image Wrap */}
      <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="text-4xl select-none">🌾</span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">by {product.farmer_name}</p>
        {product.category && (
          <span className="inline-block self-start mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full">
            {product.category.name}
          </span>
        )}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="text-lg font-extrabold text-gray-900">₹{product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 font-medium">
            {!isOutOfStock ? `${product.available_quantity} available` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
}
