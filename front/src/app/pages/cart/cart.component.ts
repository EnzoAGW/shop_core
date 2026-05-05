import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatTableModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart = inject(CartService);
  private router = inject(Router);

  readonly items = this.cart.items;
  readonly total = this.cart.total;
  displayedColumns = ['product', 'price', 'quantity', 'subtotal', 'remove'];

  increment(productId: number) {
    const item = this.items().find(i => i.product.id === productId)!;
    this.cart.updateQuantity(productId, item.quantity + 1);
  }

  decrement(productId: number) {
    const item = this.items().find(i => i.product.id === productId)!;
    this.cart.updateQuantity(productId, item.quantity - 1);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/catalog']);
  }
}
