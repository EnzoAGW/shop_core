import api from '@/lib/api';
import type { Product, Category } from '@/models';

export const getProducts = (categoryId?: number, search?: string) => {
  const params: Record<string, string | number> = {};
  if (categoryId) params.categoryId = categoryId;
  if (search?.trim()) params.search = search.trim();
  return api.get<Product[]>('/products', { params }).then((r) => r.data);
};

export const getProduct = (id: number) =>
  api.get<Product>(`/products/${id}`).then((r) => r.data);

export const getCategories = () =>
  api.get<Category[]>('/categories').then((r) => r.data);
