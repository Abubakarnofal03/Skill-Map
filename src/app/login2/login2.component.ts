import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})

export class Login2Component implements OnInit {
  Username: string = '';
  Password: string = '';
  role: string | null = null;
  loginError: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the role from query params or localStorage (whichever is available)
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.role = storedRole;
    } else {
      this.role = null;
    }
  }
  
  home() {
    this.router.navigate(['/login']);
  }

  checkcredentials(): void {
    const loginData = {
      username: this.Username,
      password: this.Password,
      role: this.role
    };

    // Use HttpHeaders to ensure proper content type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://127.0.0.1:8000/api/login/', loginData, { 
      headers: headers,
      withCredentials: true,
      observe: 'response'  // Get the full response including headers
    }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        if (response.body.message === 'Login successful') {
          // Store authentication info
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', this.Username);
          
          // Store the CSRF token if available
          const csrfToken = this.getCookie('csrftoken');
          if (csrfToken) {
            localStorage.setItem('csrfToken', csrfToken);
          }
          
          if (this.role === 'admin') {
            this.router.navigate(['/project']);
          } else if (this.role === 'employee') {
            this.router.navigate(['/employee']);
          } else {
            this.loginError = 'Unauthorized role';
          }
        } else {
          this.loginError = 'Invalid credentials';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = 'Invalid credentials, please try again';
      }
    });
  }

  // Helper method to get cookies
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }
}