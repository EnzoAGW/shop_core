'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { login } from '@/services/auth.service';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const doLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'alice@example.com', password: 'Pass123!' },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await login(data);
      doLogin(res);
      router.replace('/catalog');
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex gradient-bg flex-1 flex-col items-center justify-center text-white p-12">
        <Store size={64} className="mb-6 opacity-90" />
        <h1 className="text-4xl font-bold mb-4">ShopCore</h1>
        <p className="text-xl opacity-80 text-center max-w-xs">
          Your full-stack e-commerce platform. Buy, sell, manage — all in one place.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-[#f0f2f8]">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="gradient-bg rounded-lg p-1.5 text-white"><Store size={20} /></div>
            <span className="font-bold text-xl gradient-text">ShopCore</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('password')} type="password" placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full gradient-bg text-white py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
