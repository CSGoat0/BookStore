import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  constructor(private productsService: ProductsService, private router: Router) { }
  products!: Product[];
  filteredProducts!: Product[];
  receiveProducts() {
    this.productsService.getProducts().subscribe(
      {
        next: (data) => {
          console.log(data);
          this.products = data.books;
          this.filteredProducts = this.products; // Initialize filteredProducts with all products
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      }
    );
  }

  searchFilter() {
    const searchTerm = (document.getElementById('search') as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product => product.title.toLowerCase().includes(searchTerm)
      || product.author.toLowerCase().includes(searchTerm) || product.genre.toLowerCase().includes(searchTerm)
      || product.description?.toLowerCase().includes(searchTerm) || product.publisher?.toLowerCase().includes(searchTerm)
      || product.isbn?.toLowerCase().includes(searchTerm) || product.format?.toString().includes(searchTerm)
      || product.language?.toLowerCase().includes(searchTerm) || product.sku.toString().includes(searchTerm));
  }


  ngOnInit(): void {
    this.receiveProducts();
  }

  // Object to track the open/closed state of each category
  categoryStates: { [key: string]: boolean } = {
    fiction: true,  // Set to true to have it open by default
    nonfiction: false,
    biography: false,
    children: false
  };

  // Toggle a category's open/closed state
  toggleCategory(category: string): void {
    this.categoryStates[category] = !this.categoryStates[category];
  }

  // Check if a category is open
  isCategoryOpen(category: string): boolean {
    return this.categoryStates[category];
  }

  // redirectToProduct(productId: string) {
  //   // Replace 'product-details' with your actual route path
  //   // and adjust the parameter name as needed
  //   this.router.navigate(['/product-details', productId]);

  //   // Alternative if you're using query parameters:
  //   // this.router.navigate(['/product-details'], { queryParams: { id: productId } });
  // }
}
