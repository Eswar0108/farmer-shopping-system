export default function QuantitySelector({ quantity, max, onChange }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white max-w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-extrabold text-sm cursor-pointer"
      >
        -
      </button>
      <span className="px-4 text-sm font-bold text-gray-800 min-w-[36px] text-center select-none">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-extrabold text-sm cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
