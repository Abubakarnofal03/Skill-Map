import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Check if the user is authenticated (check for a flag or token)
    if (localStorage.getItem('isAuthenticated') === 'true') {
      // User is authenticated, allow navigation
      return true;
    } else {
      // User is not authenticated, redirect to login page
      this.router.navigate(['/login2']);
      return false;
    }
  }
}
