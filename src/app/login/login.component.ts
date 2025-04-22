import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {
    // Clear any existing authentication on login page load
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
  }

  // Store the selected role in localStorage and navigate to the login2 page
  setRole(role: string) {
    // Save the role to localStorage
    localStorage.setItem('userRole', role);
    // Navigate to the login2 component with the role as a query parameter
    this.router.navigate(['/login2'], { queryParams: { role } });
  }
}