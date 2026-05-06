'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt, ChevronDown, ChevronUp, PackageOpen } from 'lucide-react';
import { getOrders } from '@/services/order.service';
import type { Order, OrderStatus } from '@/models';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/catalog" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Receipt size={24} /> My Orders
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center text-gray-400">
          <PackageOpen size={64} className="mb-4 opacity-50" />
          <p className="text-lg font-medium mb-4">No orders yet</p>
          <Link href="/catalog" className="gradient-bg text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap items-center gap-3 text-left">
                  <span className="font-semibold text-gray-800">Order #{order.id}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-brand">{formatCurrency(order.total)}</span>
                  <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                </div>
                {expanded === order.id ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="divide-y divide-gray-50 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">{item.productName} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  {order.processedAt && (
                    <p className="text-xs text-gray-400">Processed: {formatDate(order.processedAt)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <Header />
      <OrdersContent />
    </AuthGuard>
  );
}
