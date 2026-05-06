import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopCore',
  description: 'A full-stack e-commerce platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-surface antialiased">{children}</body>
    </html>
  );
}
