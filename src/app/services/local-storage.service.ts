import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  getItem(key: string): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  }
  
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
  
  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
  
  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}