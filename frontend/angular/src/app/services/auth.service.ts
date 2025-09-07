// auth.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { User } from '../interfaces/user';
import { LoginResponse } from '../interfaces/login-response';
import { RegisterResponse } from '../interfaces/register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    this.autoLogin();
  }

  // Login method
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    console.log('🔐 Login attempt:', credentials.email);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Login successful, setting session');
        if (response.token && response.user) {
          this.setSession(response.token, response.user);
        }
      }),
      catchError(error => {
        console.error('❌ Login failed:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  // Register method
  register(userData: { name: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  // Set session after successful login
  private setSession(token: string, user: User): void {
    console.log('🔐 setSession called');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NULL');
    console.log('User:', user);

    try {
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.tokenSubject.next(token);
      this.currentUserSubject.next(user);

      // Verify what was actually stored
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');
      console.log('✅ Storage verification - Token:', !!storedToken, 'User:', !!storedUser);

    } catch (error) {
      console.error('❌ Error storing session:', error);
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserSubject.value?._id || null;
  }

  // Get auth token
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - currentTime

      if (timeUntilExpiry <= 0) {
        console.log('❌ Token expired');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Auto-login on app initialization
  autoLogin(): void {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Verify token is still valid
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          this.tokenSubject.next(token);
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }
}
