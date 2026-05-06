import api from '@/lib/api';
import type { Store, CreateStoreDto, UpdateStoreDto, CreateSellerProductDto, UpdateSellerProductDto, Product } from '@/models';

export const getStore = () => api.get<Store>('/seller/store').then((r) => r.data);
export const createStore = (dto: CreateStoreDto) => api.post<Store>('/seller/store', dto).then((r) => r.data);
export const updateStore = (dto: UpdateStoreDto) => api.put('/seller/store', dto);

export const getSellerProducts = () => api.get<Product[]>('/seller/products').then((r) => r.data);
export const createProduct = (dto: CreateSellerProductDto) => api.post<Product>('/seller/products', dto).then((r) => r.data);
export const updateProduct = (id: number, dto: UpdateSellerProductDto) => api.put(`/seller/products/${id}`, dto);
export const deleteProduct = (id: number) => api.delete(`/seller/products/${id}`);
