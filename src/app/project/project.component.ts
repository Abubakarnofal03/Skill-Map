
// project.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PD } from '../model/PD.model';
import { ProjectService } from '../services/project.service';
import { style } from '@angular/animations';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  selectedOption: string = ''; 
  isAddProjectModalOpen: boolean = false; 
  projects: PD[] = [];
  nameError = false;
  descriptionError = false;
  typeError=false;

  newProject: PD = {
    name: '',
    description: '',
    type: '',
    startdate: new Date(),
    enddate: new Date(),
    status: 'Pending',
    tasks: [],
    teammembers: []
  };

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private browserStorage: BrowserStorageService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }


  navigateTo(page: string): void {
    this.selectedOption = page; // Set the selected option when clicked
    if (page === 'teams') {
      this.projectService.setProjects(this.projects); // Store projects in the service
      this.router.navigate(['/teams']);
    } else {
      this.router.navigate([`/${page}`]);
    }
  }
  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  viewProjectDetails(project: PD): void {
    this.router.navigate(['/projectdetails'], { state: { project } });
  }


  logout(): void {
    this.browserStorage.setItem('isAuthenticated', 'false');
    this.router.navigate(['/login2']);
  }
  openAddProjectForm(): void {
    this.isAddProjectModalOpen = true;
  }

  dateError: string | null = null;

  validateDates(): void {
    if (!this.newProject.startdate || !this.newProject.enddate) {
        this.dateError = null; // No error if either date is missing
        return;
    }

    const startDate = new Date(this.newProject.startdate);
    const endDate = new Date(this.newProject.enddate);

    if (startDate > endDate) {
        this.dateError = 'Start date cannot be after the end date.';
    } else {
        this.dateError = null;
    }
}

  
  closeAddProjectForm(): void {
      this.isAddProjectModalOpen = false;
      this.dateError = null; // Reset error when closing form
      this.resetErrors();  // Reset other errors if any
  }
  

  addProject(): void {
    // Reset error flags
    this.resetErrors();

    // Validate name and description are not numbers
    if (this.isNumeric(this.newProject.name)) {
      this.nameError = true;
      return;
    }

    if (this.isNumeric(this.newProject.description)) {
      this.descriptionError = true;
      return;
    }
    if (this.isNumeric(this.newProject.type)) {
      this.typeError = true;
      return;
    }

    if (this.newProject.name && this.newProject.description && this.newProject.type) {
      this.projectService.addProject(this.newProject).subscribe((project) => {
        this.projects.push(project);
        this.closeAddProjectForm();
        this.newProject = { name: '', description: '', type: '', startdate: new Date(), enddate: new Date(), status: 'Pending', tasks: [], teammembers: [] };
      });
    }
  }

  // Helper function to check if a string is numeric
  isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== '';
  }

  // Reset error flags
  resetErrors(): void {
    this.nameError = false;
    this.descriptionError = false;
  }
}

