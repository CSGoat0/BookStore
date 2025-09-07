export interface Product {
  // Basic Identification
  _id: string;
  title: string;
  author: string;
  isbn: string;
  sku: string;

  // Categorization
  genre: string;
  categories?: string[];
  publisher?: string;

  // Book Details
  publicationYear?: number;
  edition?: string;
  format?: 'paperback' | 'hardcover' | 'ebook' | 'audiobook';
  pages?: number;
  language?: string;

  // Pricing & Inventory
  price: number;
  originalPrice?: number;
  stock: number;

  // Descriptive Information
  description?: string;
  coverImage?: string;

  // Book Metadata
  dimensions?: {
    height?: number;
    width?: number;
    thickness?: number;
  };
  weight?: number;

  // Status
  isActive?: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
