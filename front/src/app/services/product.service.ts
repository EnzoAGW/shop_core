import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(categoryId?: number, search?: string) {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId);
    if (search?.trim()) params = params.set('search', search.trim());
    return this.http.get<Product[]>('/api/products', { params });
  }

  getProduct(id: number) {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>('/api/categories');
  }
}
