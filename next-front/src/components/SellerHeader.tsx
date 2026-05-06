'use client';

import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';

interface Props { backHref?: string; backLabel?: string; }

export default function SellerHeader({ backHref = '/catalog', backLabel = 'Back to Catalog' }: Props) {
  return (
    <header className="gradient-bg text-white px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2 font-bold text-lg">
        <Store size={22} />
        <span>Seller Portal</span>
      </div>
      <Link href={backHref}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/40 hover:bg-white/20 transition-colors text-sm">
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">{backLabel}</span>
      </Link>
    </header>
  );
}
