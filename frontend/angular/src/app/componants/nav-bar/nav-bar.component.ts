import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isAccountMenuOpen = false;

  toggleAccountMenu(): void {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu(): void {
    this.isAccountMenuOpen = false;
  }

  cartCount: number = 0;

  constructor(private cartService: CartService, private authService: AuthService) { }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.loadCartCount();

    // Listen for custom events when cart is updated
    window.addEventListener('cartUpdated', () => {
      this.loadCartCount();
    });
  }

  loadCartCount(): void {
    try {
      this.cartService.getCartCount().subscribe({
        next: (response) => {
          this.cartCount = response.count;
        },
        error: (error) => {
          console.error('Error fetching cart count:', error);
        }
      });
    } catch (error: any) {
      console.error('Error in loadCartCount:', error.message);
    }
  }
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-dropdown-container') && !target.closest('.category-header')) {
      this.isAccountMenuOpen = false;
    }
  }
}
