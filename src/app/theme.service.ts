// theme.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeEnabled = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleDarkMode(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    if (isPlatformBrowser(this.platformId)) {
      if (this.darkModeEnabled) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  isDarkModeEnabled(): boolean {
    return this.darkModeEnabled;
  }
}
