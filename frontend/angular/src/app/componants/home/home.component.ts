import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    ProductCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService, private router: Router) { }

  products!: Product[];
  featuredProducts!: Product[];
  bottomProducts!: Product[];

  receiveProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data.books;

        // Split products into different sections
        this.featuredProducts = this.products.slice(0, 8); // First 8 products as featured
        this.bottomProducts = this.products.slice(8, 12);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  ngOnInit(): void {
    this.receiveProducts();
  }

  redirectToProduct(productId: string) {
    // Replace 'product-details' with your actual route path
    // and adjust the parameter name as needed
    this.router.navigate(['/product-details', productId]);

    // Alternative if you're using query parameters:
    // this.router.navigate(['/product-details'], { queryParams: { id: productId } });
  }
}
