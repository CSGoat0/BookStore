// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavBarComponent } from './componants/nav-bar/nav-bar.component';
import { FooterComponent } from './componants/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Bookstore';
  authService = inject(AuthService);

  ngOnInit() {
    // Check authentication status on app initialization
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
