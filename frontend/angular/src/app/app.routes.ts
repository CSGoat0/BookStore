import { Routes } from '@angular/router';
import { HomeComponent } from './componants/home/home.component';
import { AboutComponent } from './componants/about/about.component';
import { ContactsComponent } from './componants/contacts/contacts.component';
import { ProductsComponent } from './componants/products/products.component';
import { NotFoundComponent } from './componants/not-found/not-found.component';
import { Link1Component } from './componants/link1/link1.component';
import { Link3Component } from './componants/link3/link3.component';
import { Link2Component } from './componants/link2/link2.component';
import { LoginComponent } from './componants/login/login.component';
import { SignupComponent } from './componants/signup/signup.component';
import { ProductDetailsComponent } from './componants/product-details/product-details.component';
import { CartComponent } from './componants/cart/cart.component';
import { BookManagementComponent } from './componants/book-management/book-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'contacts', component: ContactsComponent, title: 'Contacts' },
  {
    path: 'products', component: ProductsComponent, title: 'Products', children: [
      { path: 'link1', component: Link1Component, title: 'link 1' },
      { path: 'link2', component: Link2Component, title: 'link 2' },
      { path: 'link3', component: Link3Component, title: 'link 3' }
    ]
  },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Sign Up' },
  { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product Details' },
  { path: 'cart', component: CartComponent, title: 'Shopping Cart' },
  { path: 'admin/books', component: BookManagementComponent, title: 'Book Management' },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: '**', component: NotFoundComponent, title: 'Not Found' }
];
