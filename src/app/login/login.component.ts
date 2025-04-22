import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private browserStorage: BrowserStorageService
  ) {
    this.browserStorage.removeItem('isAuthenticated');
    this.browserStorage.removeItem('authToken');
  }

  setRole(role: string) {
    this.browserStorage.setItem('userRole', role);
    this.router.navigate(['/login2'], { queryParams: { role } });
  }
}