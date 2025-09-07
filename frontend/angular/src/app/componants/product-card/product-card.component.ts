// product-card.component.ts
import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../interfaces/cart-item';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  isAddingToCart = false;
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | null = null;

  // Modal properties
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.cart.items;
      },
      error: (error) => {
        console.error('Get cart error:', error.message);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  cardItem: CartItem | undefined;

  // Convert the Observable to a Promise to use with await
  private async getCartItem(id: string): Promise<CartItem | undefined> {
    try {
      const cart = await firstValueFrom(this.cartService.getCart());
      return cart.cart.items.find(item => (item.bookId as any)._id === id);
    } catch (error) {
      console.error('Get cart error:', error);
      return undefined;
    }
  }

  private notifyCartUpdate(): void {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  async onAddToCart(event: Event): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    // Validate stock before proceeding
    if (!this.product._id || this.product.stock === 0 || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;

    try {
      // Wait for the cart item to be fetched
      const cartItem = await this.getCartItem(this.product._id);

      // Additional check to prevent adding more than available stock
      if (cartItem && cartItem.quantity >= this.product.stock) {
        this.showStockLimitModal();
        this.isAddingToCart = false;
        return;
      }

      // Proceed with adding to cart
      this.cartService.addToCart(this.product._id, 1).subscribe({
        next: (data) => {
          console.log('Add to cart response:', data);
          this.addToCart.emit(this.product);
          this.notifyCartUpdate();

          // Visual feedback
          const button = event.target as HTMLElement;
          button.classList.add('added');
          setTimeout(() => {
            button.classList.remove('added');
            this.isAddingToCart = false;
          }, 500);
        },
        error: (error) => {
          console.error('Add to cart error:', error);

          // Handle specific error cases
          if (error.message?.includes('authenticated') || error.status === 401) {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url }
            });
          }

          this.isAddingToCart = false;
        }
      });

    } catch (error) {
      console.error('Error in onAddToCart:', error);
      this.isAddingToCart = false;
    }
  }

  showStockLimitModal(): void {
    this.modalTitle = 'Stock Limit Reached';
    this.modalMessage = `You cannot add more than ${this.product.stock} copies of "${this.product.title}" to your cart.`;
    this.modalType = 'error';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onCardClick(event: Event): void {
    // Only navigate if the click wasn't on the add to cart button
    const target = event.target as HTMLElement;
    if (!target.closest('.add-to-cart-btn')) {
      // Navigate to product details page
      if (this.product._id) {
        this.router.navigate(['/product', this.product._id]);
      }
    }
  }

  getDiscount(): number | null {
    if (this.product.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return null;
  }
}
