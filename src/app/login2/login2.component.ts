import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component {
  Username: string = '';
  Password: string = '';
  loginError: string = '';

  constructor(
    private router: Router,
    private browserStorage: BrowserStorageService
  ) {}

  checkcredentials(): void {
    // Add your authentication logic here
    if (this.Username && this.Password) {
      // Simple example - replace with actual authentication
      this.browserStorage.setItem('isAuthenticated', 'true');
      this.browserStorage.setItem('username', this.Username);
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = 'Please enter both username and password';
    }
  }

  login(): void {
    this.browserStorage.setItem('isAuthenticated', 'true');
    this.router.navigate(['/dashboard']);
  }
}