// services/book-management.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book';

export interface BookResponse {
  success: boolean;
  books?: Book[];
  book?: Book;
  count?: number;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    pages: number;
  };
  error?: string;
  message?: string;
}

export interface BooksFilter {
  page?: number;
  limit?: number;
  genre?: string;
  isActive?: boolean;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookManagementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/books'; // Adjust based on your API URL

  // Create a new book
  createBook(bookData: any): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, bookData);
  }

  // Get all books with optional filtering and pagination
  getBooks(filter: BooksFilter = {}): Observable<BookResponse> {
    let params = new HttpParams();

    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());
    if (filter.genre) params = params.set('genre', filter.genre);
    if (filter.isActive !== undefined) params = params.set('isActive', filter.isActive.toString());
    if (filter.searchTerm) params = params.set('q', filter.searchTerm);

    return this.http.get<BookResponse>(this.apiUrl, { params });
  }

  // Get a single book by ID
  getBookById(id: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${id}`);
  }

  // Update a book
  updateBook(id: string, bookData: any): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, bookData);
  }

  // Delete (deactivate) a book
  deleteBook(id: string): Observable<BookResponse> {
    return this.http.delete<BookResponse>(`${this.apiUrl}/${id}`);
  }

  // Search books
  searchBooks(searchTerm: string, page: number = 1, limit: number = 10): Observable<BookResponse> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BookResponse>(`${this.apiUrl}/search`, { params });
  }
}
