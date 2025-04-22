import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { PD } from '../model/PD.model';
import { TeamMember } from '../model/teammember.model';
import { task } from '../model/task.model'; // Import the task interface
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit, OnDestroy {
  projects: PD[] = [];
  selectedProject: PD | null = null;
  selectedOption: string = '';
  projectsSubscription: Subscription = new Subscription();
  isFormingTeam: boolean = false;
  errorMessage: string | null = null;
  unassignedTasks: task[] = []; 

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['projects']) {
      this.projects = navigation.extras.state['projects'];
    }
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

  private loadProjects(): void {
    this.projectsSubscription = this.projectService.getProjects().subscribe({
      next: (projects: PD[]) => {
        this.projects = projects;
        if (this.projects.length === 0) {
          console.log('No projects available!');
        }
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.errorMessage = 'Failed to load projects. Please try again later.';
      }
    });
  }

  selectProject(project: PD): void {
    this.selectedProject = project;
    this.selectedOption = project.name;
    this.updateUnassignedTasks(); // Update unassigned tasks when a project is selected
  }

  formTeam(): void {
    if (!this.selectedProject?.id) {
      this.errorMessage = 'No project selected!';
      return;
    }

    this.isFormingTeam = true;
    this.errorMessage = null;

    this.projectService.formTeam(this.selectedProject.id).subscribe({
      next: (updatedProject: PD) => {
        this.selectedProject = updatedProject;
        this.isFormingTeam = false;
        this.updateUnassignedTasks(); // Update unassigned tasks after forming team
        this.refreshProjectsList();
      },
      error: (err) => {
        console.error('Error forming team:', err);
        this.errorMessage = 'Failed to form team. Please try again.';
        this.isFormingTeam = false;
      }
    });
  }

  private updateUnassignedTasks(): void {
    if (this.selectedProject && this.selectedProject.tasks) {
        this.unassignedTasks = this.selectedProject.tasks.filter(task => {
            // If task.assigned_to is null, the task is unassigned
            return !task.assigned_to;
        });
    } else {
        this.unassignedTasks = [];
    }
  }

  private refreshProjectsList(): void {
    this.projectService.getProjects().subscribe({
      next: (projects: PD[]) => {
        this.projects = projects;
        if (this.selectedProject) {
          const freshProject = projects.find(p => p.id === this.selectedProject?.id);
          this.selectedProject = freshProject || null;
          this.updateUnassignedTasks(); // Update unassigned tasks after refresh
        }
      },
      error: (err) => {
        console.error('Error refreshing projects:', err);
      }
    });
  }

  navigateTo(page: string): void {
    this.selectedOption = page;
    switch (page) {
      case 'dashboard':
        this.router.navigate(['/dashboard']);
        break;
      case 'project':
        this.router.navigate(['/project']);
        break;
      case 'teams':
        this.router.navigate(['/teams']);
        break;
    }
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login2']);
  }
}