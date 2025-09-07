import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Add this import
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;
  isAddingToCart = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private subscription: Subscription = new Subscription();

  // Modal properties
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  countInCart = 0;

  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.countInCart = 0;
  }

  private notifyCartUpdate(): void {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }

  public loadProduct(): void {
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            throw new Error('Product ID not found');
          }
          return this.getProductDetails(id);
        })
      ).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load product details';
          this.loading = false;
          console.error('Error loading product:', error);
        }
      })
    );
  }

  private getProductDetails(id: string): Observable<Product> {
    // Since your current service only gets all products, we'll need to filter
    // You might want to update your service to get a single product by ID
    return new Observable(observer => {
      this.productsService.getProducts().subscribe({
        next: (response: any) => {
          const product = response.books.find((p: Product) => p._id === id);
          if (product) {
            observer.next(product);
          } else {
            observer.error('Product not found');
          }
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  updateCartCount(): Observable<number> {
    return this.cartService.getCart().pipe(
      map(cart => {
        const item = cart.cart.items.find(i => (i.bookId as any)._id === this.product?._id);
        const quantity = item ? item.quantity : 0;
        this.countInCart = quantity; // Update the component property
        return quantity; // Return the value for the observable stream
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        // Return a safe default value and continue the stream
        this.countInCart = 0;
        return of(0);
      })
    );
  }

  onAddToCart(): void {
    if (!this.product || !this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.updateCartCount().pipe(
      tap(e => {
        // This runs after the count is updated
        if ((this.quantity + this.countInCart) > this.product!.stock) {
          this.failedToAddModal(`Cannot add more than ${this.product!.stock} items to the cart.`);
          return;
        }
        this.isAddingToCart = true;
        this.cartService.addToCart(this.product!._id, this.quantity).subscribe({
          next: () => {
            this.isAddingToCart = false;
            this.notifyCartUpdate();
            this.addedToCartModal();
          },
          error: (error) => {
            this.isAddingToCart = false;
            this.failedToAddModal(error.message || 'Failed to add item to cart. Please try again.');
          }
        });
      })
    ).subscribe();
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getDiscount(): number | null {
    if (this.product?.originalPrice && this.product.originalPrice > this.product.price) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return null;
  }

  formatDimensions(): string {
    if (!this.product?.dimensions) return 'N/A';

    const { height, width, thickness } = this.product.dimensions;
    if (height && width && thickness) {
      return `${height} × ${width} × ${thickness} cm`;
    }
    return 'N/A';
  }

  // Add this method to handle image errors
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // The placeholder will show automatically due to *ngIf
  }

  // Add this method to validate quantity input
  validateQuantity(): void {
    if (this.product) {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > this.product.stock) {
        this.quantity = this.product.stock;
      }
    }
  }

  addedToCartModal(): void {
    this.modalTitle = 'Item added to Cart';
    this.modalMessage = `you have successfully added ${this.quantity} "${this.product?.title}" to your cart.`;
    this.modalType = 'success';
    this.showModal = true;
  }

  failedToAddModal(message: string): void {
    this.modalTitle = 'Failed to add to Cart';
    this.modalMessage = message || `There was an issue adding "${this.product?.title}" to your cart. Please try again.`;
    this.modalType = 'error';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
