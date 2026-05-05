export interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  processedAt: string | null;
  items: OrderItem[];
}

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
}
