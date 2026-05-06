'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, SlidersHorizontal, ShoppingCart, PackageSearch } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { getProducts, getCategories } from '@/services/product.service';
import type { Product, Category } from '@/models';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { formatCurrency } from '@/lib/utils';

function CatalogContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const add = useCartStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(categoryId || undefined, search);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId]);

  useEffect(() => { getCategories().then(setCategories); }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleAdd = (product: Product) => {
    add(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..." className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand appearance-none w-full sm:w-48">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <PackageSearch size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl shadow-sm overflow-hidden flex flex-col ${product.stock === 0 ? 'opacity-70' : ''}`}>
                  <div className="relative h-48">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    <span className="absolute top-2 left-2 bg-white/90 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      {product.categoryName}
                    </span>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">Out of stock</span>
                      </div>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                      <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand text-base">{formatCurrency(product.price)}</span>
                      <button onClick={() => handleAdd(product)} disabled={product.stock === 0}
                        className="flex items-center gap-1.5 gradient-bg text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40">
                        <ShoppingCart size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-5 py-3 rounded-full text-sm shadow-lg z-50 animate-in">
          {toast}
        </div>
      )}
    </>
  );
}

export default function CatalogPage() {
  return (
    <AuthGuard>
      <Header />
      <CatalogContent />
    </AuthGuard>
  );
}
