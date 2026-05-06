'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, PackageOpen } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { formatCurrency } from '@/lib/utils';

function CartContent() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const router = useRouter();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/catalog" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={24} /> Shopping Cart
          {items.length > 0 && <span className="text-base font-normal text-gray-500">({items.length} item{items.length !== 1 ? 's' : ''})</span>}
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center text-gray-400">
          <PackageOpen size={64} className="mb-4 opacity-50" />
          <p className="text-lg font-medium mb-4">Your cart is empty</p>
          <Link href="/catalog" className="gradient-bg text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead className="border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(({ product, quantity }) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                          </div>
                          <span className="font-medium text-sm text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">
                        {formatCurrency(product.price * quantity)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => remove(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-lg font-bold text-gray-800">
              Total: <span className="gradient-text">{formatCurrency(total())}</span>
            </div>
            <div className="flex gap-3">
              <Link href="/catalog" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Continue Shopping
              </Link>
              <button onClick={() => router.push('/checkout')}
                className="gradient-bg text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <Header />
      <CartContent />
    </AuthGuard>
  );
}
