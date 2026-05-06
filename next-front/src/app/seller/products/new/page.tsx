'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Loader2 } from 'lucide-react';
import { createProduct } from '@/services/seller.service';
import { getCategories } from '@/services/product.service';
import type { Category } from '@/models';
import AuthGuard from '@/components/AuthGuard';
import SellerHeader from '@/components/SellerHeader';

const schema = z.object({
  name: z.string().min(3, 'Minimum 3 characters'),
  description: z.string().min(10, 'Minimum 10 characters'),
  price: z.coerce.number().min(0.01, 'Minimum $0.01'),
  stock: z.coerce.number().int().min(0, 'Minimum 0'),
  categoryId: z.coerce.number().min(1, 'Select a category'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

function ProductFormContent() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => { getCategories().then(setCategories); }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
  });

  const onSubmit = async (data: FormData) => {
    await createProduct({ ...data, imageUrl: data.imageUrl || undefined });
    setToast('Product added!');
    setTimeout(() => router.push('/seller'), 1000);
  };

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="gradient-bg rounded-xl p-3 text-white mb-3"><Package size={28} /></div>
          <h1 className="text-xl font-bold text-gray-800">Add Product</h1>
        </div>

        {toast && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4 text-center">{toast}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name')} placeholder="Product name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Describe the product..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input {...register('price')} type="number" step="0.01" placeholder="0.00"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input {...register('stock')} type="number" placeholder="0"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select {...register('categoryId')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white">
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input {...register('imageUrl')} placeholder="https://..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push('/seller')}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 gradient-bg text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Adding...</> : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function NewProductPage() {
  return (
    <AuthGuard>
      <SellerHeader backHref="/seller" backLabel="Back to Dashboard" />
      <ProductFormContent />
    </AuthGuard>
  );
}
