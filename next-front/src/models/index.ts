export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; email: string; name: string; }

export interface Category { id: number; name: string; }
export interface Product {
  id: number; name: string; description: string; price: number;
  stock: number; imageUrl: string; categoryName: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export interface OrderItem { productName: string; unitPrice: number; quantity: number; subtotal: number; }
export interface Order {
  id: number; status: OrderStatus; total: number;
  createdAt: string; processedAt?: string; items: OrderItem[];
}
export interface CheckoutItem { productId: number; quantity: number; }
export interface CheckoutRequest { items: CheckoutItem[]; }

export interface Store {
  id: number; name: string; description: string;
  logoUrl?: string; createdAt: string; productCount: number;
}
export interface CreateStoreDto { name: string; description: string; logoUrl?: string; }
export interface UpdateStoreDto { name: string; description: string; logoUrl?: string; }
export interface CreateSellerProductDto {
  name: string; description: string; price: number;
  stock: number; categoryId: number; imageUrl?: string;
}
export interface UpdateSellerProductDto {
  name: string; description: string; price: number;
  stock: number; imageUrl?: string;
}

export interface CartItem { product: Product; quantity: number; }
