export default function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => onSelectCategory("")}
        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
          selectedCategoryId === ""
            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        All Categories
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelectCategory(c.id)}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
            selectedCategoryId === c.id
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
