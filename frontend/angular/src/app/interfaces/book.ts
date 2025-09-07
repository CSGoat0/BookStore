export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  genre: string;
  format: string;
  coverImage?: string;
  pages?: number;
  publisher?: string;
  publishedDate?: Date;
  language: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
