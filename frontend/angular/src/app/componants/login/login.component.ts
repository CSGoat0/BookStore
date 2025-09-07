// login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.showSuccessModal('Login successful! Redirecting...');

        // Check for return URL
        const returnUrl = this.getReturnUrl();

        // Navigate after a short delay
        setTimeout(() => {
          this.router.navigate([returnUrl || '/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;

        let errorMessage = 'Login failed. Please check your credentials and try again.';

        if (error.message) {
          errorMessage = error.message;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.showErrorModal(errorMessage);
      }
    });
  }

  private getReturnUrl(): string {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('returnUrl') || '';
  }

  showSuccessModal(message: string) {
    this.modalTitle = 'Success';
    this.modalMessage = message;
    this.modalType = 'success';
    this.showModal = true;
  }

  showErrorModal(message: string) {
    this.modalTitle = 'Error';
    this.modalMessage = message;
    this.modalType = 'error';
    this.showModal = true;
  }

  handleModalClose() {
    this.showModal = false;
  }
}
