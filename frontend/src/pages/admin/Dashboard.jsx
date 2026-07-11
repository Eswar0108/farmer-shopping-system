import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import DashboardCard from '../../components/admin/DashboardCard';
import Loader from '../../components/common/Loader';
import { ShoppingBag, CheckCircle, PackageOpen, Layers } from 'lucide-react';

export default function AdminDashboard() {
  // Fetch all products (with high limit for analytics)
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-all-products'],
    queryFn: () => productService.getProducts({ limit: 1000 }),
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  if (productsLoading || categoriesLoading) {
    return <Loader message="Analyzing database metrics..." />;
  }

  const products = productData?.items || [];
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const totalInventory = products.reduce((acc, p) => acc + p.available_quantity, 0);
  const totalCategories = categories.length;

  return (
    <div className="space-y-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h2>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon={ShoppingBag}
          color="blue"
        />
        <DashboardCard
          title="Active Products"
          value={activeProducts}
          icon={CheckCircle}
          color="emerald"
        />
        <DashboardCard
          title="Total Inventory"
          value={totalInventory}
          icon={PackageOpen}
          color="amber"
        />
        <DashboardCard
          title="Product Categories"
          value={totalCategories}
          icon={Layers}
          color="rose"
        />
      </div>

      {/* Quick guide / welcoming banner */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-lg font-bold text-gray-800">Welcome to your Farmer Shopping Panel</h3>
        <p className="text-sm text-gray-500 font-medium max-w-2xl leading-relaxed">
          Use the left-hand navigation menu to manage harvest products, edit quantities, deactivate expired catalog items, and view live client stores.
        </p>
      </div>
    </div>
  );
}