import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductCard from '../../components/customer/ProductCard';
import SearchBar from '../../components/customer/SearchBar';
import CategoryFilter from '../../components/customer/CategoryFilter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

export default function Home() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Query categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  // Query products with active filter
  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryId],
    queryFn: () =>
      productService.getProducts({
        page,
        limit,
        search: search || undefined,
        categoryId: categoryId || undefined,
        isActive: true, // Only active products
      }),
  });

  const products = productData?.items || [];
  const total = productData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-emerald-800 text-white py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.15),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Fresh Harvests Direct From Local Farms</h1>
          <p className="text-md sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium">
            Support local farmers while enjoying chemical-free, nutritious crops delivered to your neighborhood.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <SearchBar value={search} onChange={handleSearchChange} />
          <CategoryFilter
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Loading / Content */}
        {isLoading ? (
          <Loader message="Loading harvest list..." />
        ) : products.length === 0 ? (
          <EmptyState
            message="No products found"
            description="We couldn't find any products matching your search terms or category selection."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
