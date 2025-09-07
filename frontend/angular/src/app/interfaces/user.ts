import { Address } from "./address";
import { Cart } from "./cart";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isConfirmed: boolean;
  phone?: string;
  addresses: Address[];
  wishlist: string[];
  cart: Cart;
  createdAt?: string;
  updatedAt?: string;
}
