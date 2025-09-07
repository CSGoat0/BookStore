// sign-up.component.ts (updated)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component'; // Adjust path as needed

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm: FormGroup;
  submitted = false;
  isLoading = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.signUpForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.signUpForm.value);
      this.isLoading = false;

      this.authService.register(this.signUpForm.value).subscribe({
        next: response => {
          console.log('Sign up successful:', response);
          this.showSuccessModal('Sign up successful! You can now log in.');
          this.signUpForm.reset();
          this.submitted = false;
        },
        error: error => {
          console.error('Sign up failed:', error);
          const errorMessage = error.error?.message || 'Sign up failed. Please try again.';
          this.showErrorModal(errorMessage);
        }
      });
    }, 1500);
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
    if (this.modalType === 'success') {
      this.router.navigate(['/login']);
    }
  }
}
