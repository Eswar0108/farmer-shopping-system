import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductForm from '../../components/admin/ProductForm';
import Loader from '../../components/common/Loader';

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Load categories for drop-down
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to create product');
    },
  });

  const handleSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  if (isLoading) return <Loader message="Loading categories..." />;

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Product</h2>
      <ProductForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/products')}
        loading={createMutation.isPending}
      />
    </div>
  );
}