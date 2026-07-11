export default function EmptyState({ message = "No items found", description = "Try adjusting your filters or search terms." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-100 rounded-xl shadow-sm">
      <span className="text-4xl text-gray-300">🌾</span>
      <h3 className="text-md font-semibold text-gray-700 mt-3">{message}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}
