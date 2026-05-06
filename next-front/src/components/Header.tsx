'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Receipt, Store, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const count = useCartStore((s) => s.count);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <header className="gradient-bg text-white px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/catalog" className="flex items-center gap-2 font-bold text-lg select-none">
        <Store size={22} />
        <span>ShopCore</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-sm hidden sm:block opacity-90 mr-1">{user?.name}</span>

        <Link href="/seller" title="Seller Portal"
          className="p-2 rounded-full hover:bg-white/20 transition-colors">
          <Store size={20} />
        </Link>

        <Link href="/orders" title="My Orders"
          className="p-2 rounded-full hover:bg-white/20 transition-colors">
          <Receipt size={20} />
        </Link>

        <Link href="/cart" title="Cart"
          className="relative p-2 rounded-full hover:bg-white/20 transition-colors">
          <ShoppingCart size={20} />
          {count() > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {count()}
            </span>
          )}
        </Link>

        <button onClick={handleLogout} title="Logout"
          className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-full border border-white/40 hover:bg-white/20 transition-colors text-sm">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
