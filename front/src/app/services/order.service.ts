import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckoutRequest, Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  checkout(req: CheckoutRequest) {
    return this.http.post<Order>('/api/orders/checkout', req);
  }

  getOrders() {
    return this.http.get<Order[]>('/api/orders');
  }

  getOrder(id: number) {
    return this.http.get<Order>(`/api/orders/${id}`);
  }
}
