import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Max 200 characters'),
  category_id: z.string().uuid('Please select a category'),
  farmer_name: z.string().min(1, "Farmer's name is required").max(200, 'Max 200 characters'),
  description: z.string().optional().or(z.literal('')),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : parseFloat(val)),
    z.number({ invalid_type_error: 'Price must be a number' }).gt(0, 'Price must be greater than 0')
  ),
  available_quantity: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : parseInt(val, 10)),
    z.number({ invalid_type_error: 'Stock must be an integer' }).int().nonnegative('Stock cannot be negative')
  ),
  image_url: z.string().optional().or(z.literal('')),
});

export default function ProductForm({ initialData = null, categories = [], onSubmit, onCancel, loading = false }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category_id: '',
      farmer_name: '',
      description: '',
      price: '',
      available_quantity: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('category_id', initialData.category_id || '');
      setValue('farmer_name', initialData.farmer_name || '');
      setValue('description', initialData.description || '');
      setValue('price', initialData.price || '');
      setValue('available_quantity', initialData.available_quantity || 0);
      setValue('image_url', initialData.image_url || '');
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 max-w-xl">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Product Name *</label>
        <input
          type="text"
          {...register('name')}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
        />
        {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Category *</label>
        <select
          {...register('category_id')}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition bg-white"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category_id && <p className="text-xs text-red-500 font-semibold">{errors.category_id.message}</p>}
      </div>

      {/* Farmer Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Farmer Name *</label>
        <input
          type="text"
          {...register('farmer_name')}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
        />
        {errors.farmer_name && <p className="text-xs text-red-500 font-semibold">{errors.farmer_name.message}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
        />
        {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>}
      </div>

      {/* Row for price and available quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Price ($) *</label>
          <input
            type="number"
            step="0.01"
            {...register('price')}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
          />
          {errors.price && <p className="text-xs text-red-500 font-semibold">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Available Stock *</label>
          <input
            type="number"
            {...register('available_quantity')}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
          />
          {errors.available_quantity && <p className="text-xs text-red-500 font-semibold">{errors.available_quantity.message}</p>}
        </div>
      </div>

      {/* Image URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Image URL</label>
        <input
          type="text"
          {...register('image_url')}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition"
        />
        {errors.image_url && <p className="text-xs text-red-500 font-semibold">{errors.image_url.message}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
