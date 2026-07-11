import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductForm from '../../components/admin/ProductForm';
import Loader from '../../components/common/Loader';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Load product detail
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  });

  // Load categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      navigate('/admin/products');
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to update product');
    },
  });

  const handleSubmit = (formData) => {
    updateMutation.mutate(formData);
  };

  if (productLoading || categoriesLoading) {
    return <Loader message="Retrieving product parameters..." />;
  }

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Edit Product Details</h2>
      <ProductForm
        initialData={product}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/products')}
        loading={updateMutation.isPending}
      />
    </div>
  );
}