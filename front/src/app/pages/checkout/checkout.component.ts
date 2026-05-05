import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatDividerModule, MatProgressSpinnerModule, MatIconModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  readonly items = this.cart.items;
  readonly total = this.cart.total;

  loading = signal(false);
  error = signal<string | null>(null);
  placedOrder = signal<Order | null>(null);

  placeOrder() {
    this.loading.set(true);
    this.error.set(null);

    const req = {
      items: this.items().map(i => ({ productId: i.product.id, quantity: i.quantity })),
    };

    this.orderService.checkout(req).subscribe({
      next: order => {
        this.cart.clear();
        this.placedOrder.set(order);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.error ?? 'Failed to place order. Please try again.');
        this.loading.set(false);
      },
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/catalog']);
  }
}
