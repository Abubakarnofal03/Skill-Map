import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
// Comment out direct localStorage access
// if (typeof window !== 'undefined') {
//   localStorage.setItem('isAuthenticated','false');
// }