import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PD } from '../model/PD.model';
import { HttpClient } from '@angular/common/http';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {
  selectedOption: string = '';
  project: PD;
  isLoading: boolean = false;
  loadingMessage: string = 'Preparing your project details...';
  segregationDone: boolean = false;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private browserStorage: BrowserStorageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.project = navigation?.extras.state?.['project'];
  }

  ngOnInit(): void {
  }

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

  navigateToTasks(): void {
    this.router.navigate(['/tasks'], { state: { project: this.project } });
  }

  sagregateTasks(): void {
    if (this.segregationDone) {
      alert('Tasks have already been segregated for this project!');
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Segregating tasks, please wait...';

    const url = `http://localhost:8000/api/projects/${this.project.id}/segregate_tasks/`;
    this.http.get(url, {}).subscribe({
      next: (data: any) => {
        console.log("Segregated tasks:", data);
        this.project = data; // Update project with newly segregated tasks
        this.isLoading = false;
        this.loadingMessage = 'Project details updated successfully!';
        this.segregationDone = true; // ✅ Mark segregation as done

        // Optional: Auto-hide success message
        setTimeout(() => {
          this.loadingMessage = 'Preparing your project details...';
        }, 2000);
      },
      error: (err) => {
        console.error("Error segregating tasks:", err);
        this.loadingMessage = 'Failed to segregate tasks. Please try again.';
        this.isLoading = false;

        // Optional: Auto-reset error message
        setTimeout(() => {
          this.loadingMessage = 'Preparing your project details...';
        }, 3000);
      }
    });
  }

  logout(): void {
    this.browserStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login2']);
  }
}
