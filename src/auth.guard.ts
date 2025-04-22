import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './app/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Check if the user is authenticated (check for a flag or token)
    if (this.localStorageService.getItem('isAuthenticated') === 'true') {
      // User is authenticated, allow navigation
      return true;
    } else {
      // User is not authenticated, redirect to login page
      this.router.navigate(['/login2']);
      return false;
    }
  }
}
