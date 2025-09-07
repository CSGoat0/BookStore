// components/book-management/book-management.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookManagementService, BooksFilter } from '../../services/book-management.service';
import { Book } from '../../interfaces/book';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css']
})
export class BookManagementComponent implements OnInit {
  private bookService = inject(BookManagementService);

  books: Book[] = [];
  selectedBook: Book | null = null;
  isEditing = false;
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Filter properties
  filter: BooksFilter = {
    page: 1,
    limit: 10
  };
  searchTerm = '';

  // Modal properties
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  // New book form (simplified for example)
  newBook: Partial<Book> = {
    title: '',
    author: '',
    isbn: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0,
    genre: '',
    format: 'Paperback',
    language: 'English',
    isActive: true
  };

  genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help'];
  formats = ['Paperback', 'Hardcover', 'eBook', 'Audiobook'];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks(this.filter).subscribe({
      next: (response) => {
        if (response.success && response.books) {
          this.books = response.books;
          this.totalItems = response.total || 0;
          this.totalPages = response.pagination?.pages || 0;
        } else {
          this.showErrorModal('Error loading books', response.error || 'Unknown error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showErrorModal('Error loading books', error.message);
        this.isLoading = false;
      }
    });
  }

  searchBooks(): void {
    if (this.searchTerm.trim()) {
      this.filter.searchTerm = this.searchTerm.trim();
    } else {
      delete this.filter.searchTerm;
    }
    this.filter.page = 1;
    this.currentPage = 1;
    this.loadBooks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filter.page = page;
    this.loadBooks();
  }

  editBook(book: Book): void {
    this.selectedBook = { ...book };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.selectedBook = null;
    this.isEditing = false;
  }

  updateBook(): void {
    if (!this.selectedBook || !this.selectedBook._id) return;

    this.isLoading = true;
    this.bookService.updateBook(this.selectedBook._id, this.selectedBook).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessModal('Book updated successfully');
          this.loadBooks();
          this.cancelEdit();
        } else {
          this.showErrorModal('Error updating book', response.error || 'Unknown error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showErrorModal('Error updating book', error.message);
        this.isLoading = false;
      }
    });
  }

  deleteBook(book: Book): void {
    if (!book._id || !confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    this.isLoading = true;
    this.bookService.deleteBook(book._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessModal('Book deleted successfully');
          this.loadBooks();
        } else {
          this.showErrorModal('Error deleting book', response.error || 'Unknown error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showErrorModal('Error deleting book', error.message);
        this.isLoading = false;
      }
    });
  }

  createBook(): void {
    this.isLoading = true;
    this.bookService.createBook(this.newBook).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccessModal('Book created successfully');
          this.resetNewBookForm();
          this.loadBooks();
        } else {
          this.showErrorModal('Error creating book', response.error || 'Unknown error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showErrorModal('Error creating book', error.message);
        this.isLoading = false;
      }
    });
  }

  resetNewBookForm(): void {
    this.newBook = {
      title: '',
      author: '',
      isbn: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      genre: '',
      format: 'Paperback',
      language: 'English',
      isActive: true
    };
  }

  showSuccessModal(message: string): void {
    this.modalTitle = 'Success';
    this.modalMessage = message;
    this.modalType = 'success';
    this.showModal = true;
  }

  showErrorModal(title: string, message: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = 'error';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  trackByBookId(index: number, book: Book): string {
    return book._id || `${index}`;
  }
}
