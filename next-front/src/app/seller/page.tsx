'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Store, PackageOpen, Loader2, Calendar, Package } from 'lucide-react';
import { getStore, getSellerProducts, deleteProduct } from '@/services/seller.service';
import type { Store as StoreModel, Product } from '@/models';
import AuthGuard from '@/components/AuthGuard';
import SellerHeader from '@/components/SellerHeader';
import { formatCurrency, formatDate } from '@/lib/utils';

function DashboardContent() {
  const router = useRouter();
  const [store, setStore] = useState<StoreModel | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    getStore()
      .then((s) => { setStore(s); return getSellerProducts(); })
      .then(setProducts)
      .catch((err) => { if (err?.response?.status === 404) router.replace('/seller/store'); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setStore((s) => s ? { ...s, productCount: s.productCount - 1 } : s);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {store && (
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {store.logoUrl ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={store.logoUrl} alt={store.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
              <Store size={28} className="text-white" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{store.description}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Package size={12} /> {store.productCount} products</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Since {formatDate(store.createdAt)}</span>
            </div>
          </div>
          <button onClick={() => router.push('/seller/store')}
            className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Pencil size={14} /> Edit Store
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Products</h3>
          <button onClick={() => router.push('/seller/products/new')}
            className="gradient-bg text-white flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center text-gray-400">
            <PackageOpen size={48} className="mb-3 opacity-50" />
            <p className="font-medium mb-3">No products yet</p>
            <button onClick={() => router.push('/seller/products/new')}
              className="gradient-bg text-white px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-40">
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                  <span className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${product.stock < 5 ? 'bg-orange-500 text-white' : 'bg-white/90 text-gray-700'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
                  <p className="text-brand font-bold text-sm mt-0.5">{formatCurrency(product.price)}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => router.push(`/seller/products/${product.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
                      className="flex items-center justify-center gap-1 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50">
                      {deleting === product.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SellerDashboardPage() {
  return (
    <AuthGuard>
      <SellerHeader />
      <DashboardContent />
    </AuthGuard>
  );
}
