import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert(`Welcome ${response.fullName}!`);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }

  loginAsUser(): void {
    this.username = 'user';
    this.password = 'user';
    this.login();
  }

  loginAsAdmin(): void {
    this.username = 'admin';
    this.password = 'admin';
    this.login();
  }
}