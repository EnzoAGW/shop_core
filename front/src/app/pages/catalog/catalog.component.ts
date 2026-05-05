import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product, Category } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatProgressSpinnerModule, MatBadgeModule, MatIconModule,
    MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  cart = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  searchCtrl = new FormControl('');
  categoryCtrl = new FormControl<number | null>(null);

  readonly cartCount = this.cart.count;

  ngOnInit() {
    this.productService.getCategories().subscribe(cats => this.categories.set(cats));
    this.loadProducts();

    this.searchCtrl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.loadProducts());
    this.categoryCtrl.valueChanges.subscribe(() => this.loadProducts());
  }

  loadProducts() {
    this.loading.set(true);
    this.productService
      .getProducts(this.categoryCtrl.value ?? undefined, this.searchCtrl.value ?? undefined)
      .subscribe({
        next: prods => { this.products.set(prods); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  addToCart(product: Product) {
    this.cart.add(product);
    this.snackBar.open(`"${product.name}" added to cart`, 'View Cart', { duration: 2500 })
      .onAction().subscribe(() => this.router.navigate(['/cart']));
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
