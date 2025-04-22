import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PD } from '../model/PD.model';
import { task } from '../model/task.model';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  project: PD;
  selectedOption: string = ''; 

  constructor(
    private router: Router,
    private browserStorage: BrowserStorageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.project = navigation?.extras.state?.['project'];
  }

  // Add navigation method
  navigateTo(page: string): void {
    this.selectedOption = page;
    if (page === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (page === 'project') {
      this.router.navigate(['/project']);
    } else if (page === 'teams') {
      this.router.navigate(['/teams']);
    }
  }

  // Add task status update method
  updateTaskStatus(task: task, newStatus: string): void {
    task.status = newStatus;
    console.log(`Task "${task.title}" status updated to "${newStatus}"`);
  }

  // Add designations helper method
  getDesignations(designation?: string | string[]): string[] {
    if (!designation) return [];
    return Array.isArray(designation) ? designation : [designation];
  }

  logout(): void {
    this.browserStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login2']);
  }
}
