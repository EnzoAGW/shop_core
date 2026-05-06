import api from '@/lib/api';
import type { Order, CheckoutRequest } from '@/models';

export const checkout = (req: CheckoutRequest) =>
  api.post<Order>('/orders/checkout', req).then((r) => r.data);

export const getOrders = () =>
  api.get<Order[]>('/orders').then((r) => r.data);
