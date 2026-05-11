'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Loader2 } from 'lucide-react';
import { getStore, createStore, updateStore } from '@/services/seller.service';
import AuthGuard from '@/components/AuthGuard';
import SellerHeader from '@/components/SellerHeader';

const schema = z.object({
  name: z.string().min(3, 'Minimum 3 characters'),
  description: z.string().min(10, 'Minimum 10 characters'),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

function StoreFormContent() {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getStore()
      .then((store) => { setIsEdit(true); reset({ name: store.name, description: store.description, logoUrl: store.logoUrl ?? '' }); })
      .catch((err) => { if (err?.response?.status !== 404) setError('Failed to load store data. Please refresh.'); })
      .finally(() => setFetching(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const dto = { name: data.name, description: data.description, logoUrl: data.logoUrl || undefined };
    if (isEdit) await updateStore(dto);
    else await createStore(dto);
    setToast(isEdit ? 'Store updated!' : 'Store created!');
    setTimeout(() => router.push('/seller'), 1800);
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="gradient-bg rounded-xl p-3 text-white mb-3"><Store size={28} /></div>
          <h1 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Your Store' : 'Create Your Store'}</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            {isEdit ? 'Update your store details.' : 'Set up your store to start selling products.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4 text-center">{error}</div>
        )}

        {toast && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4 text-center">{toast}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input {...register('name')} placeholder="e.g. My Electronics Store"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Describe your store..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input {...register('logoUrl')} placeholder="https://..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            {errors.logoUrl && <p className="text-red-500 text-xs mt-1">{errors.logoUrl.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push(isEdit ? '/seller' : '/catalog')}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 gradient-bg text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEdit ? 'Save Changes' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function SellerStorePage() {
  return (
    <AuthGuard>
      <SellerHeader backHref="/seller" backLabel="Back to Dashboard" />
      <StoreFormContent />
    </AuthGuard>
  );
}
