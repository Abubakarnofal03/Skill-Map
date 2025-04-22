import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PD } from '../model/PD.model';
import { task } from '../model/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  project: PD;
  selectedOption: string = ''; 

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.project = navigation?.extras.state?.['project']; 
    console.log(this.project?.tasks);
  }

  // Navigation logic
  navigateTo(page: string): void {
    this.selectedOption = page;
    if (page === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (page === 'project') {
      this.router.navigate(['/project']);
    } else if (page === 'teams') {
      this.router.navigate(['/teams']);
    } else if (page === 'settings') {
      this.router.navigate(['/settings']);
    }
  }

 
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login2']);
  }

  toggleDropdown(task: task): void {
    task.showDropdown = !task.showDropdown;
  }

 
  updateTaskStatus(task: task, newStatus: string): void {
    task.status = newStatus; 
    task.showDropdown = false;
    console.log(`Task "${task.title}" status updated to "${newStatus}"`);
  }

  
  getDesignations(designation?: string | string[]): string[] {
    if (!designation) return []; // Return an empty array if undefined/null
    return Array.isArray(designation) ? designation : [designation];
  }
}
