'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { checkout } from '@/services/order.service';
import type { Order } from '@/models';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { formatCurrency } from '@/lib/utils';

function CheckoutContent() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const result = await checkout({ items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })) });
      setOrder(result);
      clear();
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <main className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-10">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">Order #{order.id}</p>
          <p className="text-xl font-bold gradient-text mb-6">{formatCurrency(order.total)}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="gradient-bg text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              View My Orders
            </Link>
            <Link href="/catalog" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} /> Order Summary
          </h2>
          <div className="divide-y divide-gray-50">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-700">{product.name} <span className="text-gray-400">× {quantity}</span></span>
                <span className="font-medium">{formatCurrency(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="gradient-text">{formatCurrency(total())}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <CreditCard size={18} /> Payment
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center gap-3">
            <CreditCard size={20} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">**** **** **** 4242</p>
              <p className="text-xs text-gray-400">Visa — Mock payment</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/cart" className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center">
            Back to Cart
          </Link>
          <button onClick={handlePlaceOrder} disabled={loading || items.length === 0}
            className="gradient-bg text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Placing order...</> : 'Place Order'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <Header />
      <CheckoutContent />
    </AuthGuard>
  );
}
