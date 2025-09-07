// cart.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { Cart } from '../../interfaces/cart';
import { CartItem } from '../../interfaces/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0 };
  isLoading = true;
  isUpdating = false;

  // Modal properties
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private notifyCartUpdate(): void {
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.cart;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.isLoading = false;
        this.showErrorModal('Failed to load cart. Please try again.');
      }
    });
  }

  // Helper method to extract bookId from CartItem
  private getBookId(item: CartItem): string {
    // If bookId is already a string, return it
    if (typeof item.bookId === 'string') {
      return item.bookId;
    }

    // If bookId is an object with _id property, return the _id
    if (typeof item.bookId === 'object' && item.bookId !== null && '_id' in item.bookId) {
      return (item.bookId as any)._id;
    }

    // Fallback: try to access _id directly
    console.warn('Unexpected bookId format:', item.bookId);
    return (item as any)._id || '';
  }

  updateQuantity(bookId: string, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.isUpdating = true;
    this.cartService.updateCartItem(bookId, newQuantity).subscribe({
      next: (response) => {
        this.cart = response.cart;
        this.isUpdating = false;
        this.notifyCartUpdate();
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        this.isUpdating = false;
        this.showErrorModal('Failed to update quantity. Please try again.');
        this.loadCart();
      }
    });
  }

  incrementQuantity(item: CartItem): void {
    const bookId = this.getBookId(item);
    this.updateQuantity(bookId, item.quantity + 1);
    this.notifyCartUpdate();
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const bookId = this.getBookId(item);
      this.updateQuantity(bookId, item.quantity - 1);
      this.notifyCartUpdate();
    }
  }

  removeItem(item: CartItem): void {
    const bookId = this.getBookId(item);
    this.isUpdating = true;
    this.cartService.removeFromCart(bookId).subscribe({
      next: (response) => {
        this.cart = response.cart;
        this.isUpdating = false;
        this.showSuccessModal('Item removed from cart.');
        this.notifyCartUpdate();
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.isUpdating = false;
        this.showErrorModal('Failed to remove item. Please try again.');
      }
    });
  }

  clearCart(): void {
    this.isUpdating = true;
    this.cartService.clearCart().subscribe({
      next: (response) => {
        this.cart = response.cart;
        this.isUpdating = false;
        this.showSuccessModal('Cart cleared successfully.');
        this.notifyCartUpdate();
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.isUpdating = false;
        this.showErrorModal('Failed to clear cart. Please try again.');
      }
    });
  }

  proceedToCheckout(): void {
    if (this.cart.items.length === 0) {
      this.showErrorModal('Your cart is empty. Add items before checkout.');
      return;
    }

    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Modal methods
  showSuccessModal(message: string): void {
    this.modalTitle = 'Success';
    this.modalMessage = message;
    this.modalType = 'success';
    this.showModal = true;
  }

  showErrorModal(message: string): void {
    this.modalTitle = 'Error';
    this.modalMessage = message;
    this.modalType = 'error';
    this.showModal = true;
  }

  handleModalClose(): void {
    this.showModal = false;
  }

  // Calculate item total
  getItemTotal(item: CartItem): number {
    return (item.price || 0) * item.quantity;
  }

  // Get item image
  getItemImage(item: CartItem): string {
    if (typeof item.bookId === 'object' && item.bookId !== null && 'coverImage' in item.bookId) {
      return (item.bookId as any).coverImage || item.image || 'assets/images/book-placeholder.jpg';
    }
    return item.image || 'assets/images/book-placeholder.jpg';
  }

  // Get item name
  getItemName(item: CartItem): string {
    if (typeof item.bookId === 'object' && item.bookId !== null && 'title' in item.bookId) {
      return (item.bookId as any).title || item.name || 'Unknown Book';
    }
    return item.name || 'Unknown Book';
  }

  // Get item price
  getItemPrice(item: CartItem): number {
    if (typeof item.bookId === 'object' && item.bookId !== null && 'price' in item.bookId) {
      return (item.bookId as any).price || item.price || 0;
    }
    return item.price || 0;
  }

  onCardClick(event: Event, id: string | undefined): void {
    // Only navigate if the click wasn't on the add to cart button
    const target = event.target as HTMLElement;
    if (!target.closest('.remove-btn') && !target.closest('.quantity-controls')) {
      // Navigate to product details page
      if (id) {
        this.router.navigate(['/product', (id as any)._id]);
      }
    }
  }
}
