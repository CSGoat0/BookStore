// cart.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Cart } from '../interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/cart';

  // Get the current user's ID
  private getCurrentUserId(): string {
    const userId = this.authService.getCurrentUserId();
    return userId ? userId : '';
  }

  // Get user's cart
  getCart(): Observable<{ success: boolean; cart: Cart }> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.get<{ success: boolean; cart: Cart }>(
      `${this.apiUrl}/${userId}`
    ).pipe(
      catchError(error => {
        console.error('Get cart error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch cart'));
      })
    );
  }

  // cart.service.ts (updated addToCart method)
  addToCart(bookId: string, quantity: number = 1): Observable<{
    success: boolean;
    message: string;
    cart: Cart
  }> {
    try {
      const userId = this.getCurrentUserId();
      console.log('Adding to cart:', { userId, bookId, quantity });

      return this.http.post<{ success: boolean; message: string; cart: Cart }>(
        `${this.apiUrl}/${userId}/add`,
        { bookId, quantity }
      ).pipe(
        tap(response => console.log('Add to cart response:', response)),
        catchError(error => {
          console.error('Add to cart error:', error);

          // Handle specific error types
          if (error.status === 401 || error.status === 403) {
            return throwError(() => new Error('Authentication required. Please login again.'));
          } else if (error.status === 404) {
            return throwError(() => new Error('Product not found.'));
          } else if (error.status === 400) {
            return throwError(() => new Error(error.error?.message || 'Insufficient stock.'));
          } else {
            return throwError(() => new Error(error.error?.message || 'Failed to add to cart. Please try again.'));
          }
        })
      );
    } catch (error) {
      console.error('Error in addToCart method:', error);
      return throwError(() => new Error('Authentication required. Please login.'));
    }
  }

  // Update cart item quantity
  updateCartItem(bookId: string, quantity: number): Observable<{
    success: boolean;
    message: string;
    cart: Cart
  }> {
    const userId = this.getCurrentUserId();
    console.log('Updating cart item:', bookId);
    return this.http.put<{ success: boolean; message: string; cart: Cart }>(
      `${this.apiUrl}/${userId}/update`,
      { bookId, quantity }
    ).pipe(
      catchError(error => {
        console.error('Update cart error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update cart'));
      })
    );
  }

  // Remove item from cart
  removeFromCart(bookId: string): Observable<{
    success: boolean;
    message: string;
    cart: Cart
  }> {
    const userId = this.getCurrentUserId();
    return this.http.delete<{ success: boolean; message: string; cart: Cart }>(
      `${this.apiUrl}/${userId}/remove`,
      { body: { bookId } }
    ).pipe(
      catchError(error => {
        console.error('Remove from cart error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to remove from cart'));
      })
    );
  }

  // Clear entire cart
  clearCart(): Observable<{
    success: boolean;
    message: string;
    cart: Cart
  }> {
    const userId = this.getCurrentUserId();
    return this.http.delete<{ success: boolean; message: string; cart: Cart }>(
      `${this.apiUrl}/${userId}/clear`
    ).pipe(
      catchError(error => {
        console.error('Clear cart error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to clear cart'));
      })
    );
  }

  // Get cart count
  getCartCount(): Observable<{
    success: boolean;
    count: number
  }> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return new Observable(observer => {
        observer.error(new Error('User not authenticated'));
        observer.complete();
      });
    }
    return this.http.get<{ success: boolean; count: number }>(
      `${this.apiUrl}/${userId}/count`
    ).pipe(
      catchError(error => {
        console.error('Get cart count error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to get cart count'));
      })
    );
  }
}
