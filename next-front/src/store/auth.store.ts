'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '@/models';

interface AuthState {
  token: string | null;
  user: Omit<LoginResponse, 'token'> | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (data) => set({ token: data.token, user: { email: data.email, name: data.name } }),
      logout: () => set({ token: null, user: null }),
      isLoggedIn: () => !!get().token,
    }),
    { name: 'sc_auth' }
  )
);
