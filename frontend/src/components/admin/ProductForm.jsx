import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../../services/ai.service';

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
    watch,
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

  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [suggestingPrice, setSuggestingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState(null);

  const watchedName = watch('name');
  const watchedCategoryId = watch('category_id');
  const watchedFarmerName = watch('farmer_name');
  const watchedPrice = watch('price');

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

  const handleGenerateDescription = async () => {
    if (!watchedName || !watchedCategoryId || !watchedFarmerName) {
      alert("Please fill in Product Name, Category, and Farmer Name first.");
      return;
    }
    const catName = categories.find((c) => c.id === watchedCategoryId)?.name || '';
    setGeneratingDesc(true);
    try {
      const res = await aiService.describeProduct({
        name: watchedName,
        price: watchedPrice || 0,
        category: catName,
        farmer_name: watchedFarmerName,
      });
      setValue('description', res.description);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate description');
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleSuggestPrice = async () => {
    if (!watchedName || !watchedCategoryId) {
      alert("Please fill in Product Name and Category first.");
      return;
    }
    const catName = categories.find((c) => c.id === watchedCategoryId)?.name || '';
    setSuggestingPrice(true);
    setPriceSuggestion(null);
    try {
      const res = await aiService.suggestPrice({
        name: watchedName,
        category: catName,
      });
      setPriceSuggestion(res);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to suggest price');
    } finally {
      setSuggestingPrice(false);
    }
  };

  const applySuggestedPrice = (val) => {
    // Parse first numeric value found in suggestions string
    const match = val.match(/\d+(\.\d+)?/);
    if (match) {
      setValue('price', match[0]);
    }
    setPriceSuggestion(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 max-w-xl font-sans">
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={generatingDesc}
            className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {generatingDesc ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
            Auto-Write with AI
          </button>
        </div>
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
          <label className="text-sm font-bold text-gray-700">Price (₹) *</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition w-full"
            />
            <button
              type="button"
              onClick={handleSuggestPrice}
              disabled={suggestingPrice}
              className="px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {suggestingPrice ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
              AI Price
            </button>
          </div>
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

      {/* Price suggestions box if available */}
      {priceSuggestion && (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2 text-xs text-gray-700">
          <div className="flex justify-between items-center font-bold text-emerald-850">
            <span>AI Price Suggestion</span>
            <button
              type="button"
              onClick={() => applySuggestedPrice(priceSuggestion.price)}
              className="px-2 py-0.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold cursor-pointer"
            >
              Apply Suggested (₹)
            </button>
          </div>
          <div><span className="font-bold">Suggested:</span> {priceSuggestion.price}</div>
          <div><span className="font-bold">Range:</span> {priceSuggestion.range}</div>
          <div><span className="font-bold">Reasoning:</span> {priceSuggestion.reason}</div>
        </div>
      )}

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
