import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import ProductTable from '../../components/admin/ProductTable';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const limit = 10;

  // Query products list for admin (without active restriction so inactive show too)
  const { data: productData, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => productService.getProducts({ page, limit }),
  });

  const products = productData?.items || [];
  const total = productData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Status toggle mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => productService.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to update status');
    },
    onSettled: () => setProcessingId(null),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteTargetId(null);
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to delete product');
      setDeleteTargetId(null);
    },
  });

  // Stock update mutation
  const updateStockMutation = useMutation({
    mutationFn: ({ id, qty }) => productService.updateStock(id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => {
      alert(err.response?.data?.detail || 'Failed to update stock');
    },
  });

  const handleToggleStatus = (id, currentStatus) => {
    setProcessingId(id);
    toggleMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleEditStock = (id, currentStock) => {
    const input = prompt('Enter new stock quantity:', currentStock);
    if (input === null) return;
    const qty = parseInt(input, 10);
    if (isNaN(qty) || qty < 0) {
      alert('Please enter a valid non-negative integer.');
      return;
    }
    updateStockMutation.mutate({ id, qty });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
  };

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Products</h2>

      {isLoading ? (
        <Loader message="Loading catalog inventory..." />
      ) : products.length === 0 ? (
        <EmptyState
          message="Catalog is empty"
          description="Click Add Product in the sidebar to add your first harvest."
        />
      ) : (
        <>
          <ProductTable
            products={products}
            processingId={processingId}
            onToggleStatus={handleToggleStatus}
            onEditStock={handleEditStock}
            onDelete={setDeleteTargetId}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Delete confirmation modal */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
        confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
