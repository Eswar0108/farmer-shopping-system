import { Link } from 'react-router-dom';
import { Edit, Trash, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

export default function ProductTable({ products, onToggleStatus, onDelete, onEditStock, processingId }) {
  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
      <table className="w-full text-sm text-left text-gray-500 border-collapse">
        <thead className="text-xs text-gray-400 uppercase bg-gray-50/70 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-bold">Product Name</th>
            <th className="px-6 py-4 font-bold">Category</th>
            <th className="px-6 py-4 font-bold">Farmer</th>
            <th className="px-6 py-4 font-bold">Price</th>
            <th className="px-6 py-4 font-bold">Stock</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => {
            const isProcessing = processingId === p.id;
            return (
              <tr key={p.id} className="hover:bg-gray-50/30 transition">
                <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-semibold text-xs">
                    {p.category?.name || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">{p.farmer_name}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{p.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{p.available_quantity}</span>
                    <button
                      onClick={() => onEditStock(p.id, p.available_quantity)}
                      className="px-2 py-0.5 border border-gray-200 hover:border-emerald-600 hover:text-emerald-700 bg-white rounded-md text-xs font-semibold text-gray-500 transition cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    p.is_active
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Status toggle */}
                    <button
                      disabled={isProcessing}
                      onClick={() => onToggleStatus(p.id, p.is_active)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        p.is_active
                          ? 'border-green-100 text-green-600 hover:bg-green-50'
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                      }`}
                      title={p.is_active ? 'Deactivate product' : 'Activate product'}
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : p.is_active ? (
                        <ToggleRight size={18} />
                      ) : (
                        <ToggleLeft size={18} />
                      )}
                    </button>
                    {/* Edit */}
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="p-1.5 border border-gray-200 hover:border-emerald-600 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Edit details"
                    >
                      <Edit size={16} />
                    </Link>
                    {/* Delete */}
                    <button
                      onClick={() => onDelete(p.id)}
                      className="p-1.5 border border-gray-200 hover:border-red-200 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Delete product"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
