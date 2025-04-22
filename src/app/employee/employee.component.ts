import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

interface Task {
  id: number;
  title: string;
  status: string;
  description: string;
  designation: string;
  duedate: string;
  tasktype: string | null;  // Add tasktype field
}

interface ProjectWithTasks {
  id: number;
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  selectedOption: string = 'employee';
  employeeName: string = 'Employee';  // Default value
  employeeSkill: string = '';
  employeeStatus: string = 'Active';  // Default value
  
  // For tasks and projects
  projectsWithTasks: ProjectWithTasks[] = [];
  activeTasksCount: number = 0;
  completedTasksCount: number = 0;
  upcomingDeadlines: Task[] = [];
  
  // For task status update
  loginError: string = '';
  isUpdating: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router, 
    private employeeService: EmployeeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return;
      }
    }
    
    this.getEmployeeDetails();
    this.getEmployeeTasks();
  }

  navigateTo(page: string): void {
    this.selectedOption = page;
    if (page === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (page === 'project') {
      this.router.navigate(['/project']);
    } else if (page === 'teams') {
      this.router.navigate(['/teams']);
    } else if (page === 'settings') {
      // Implement settings navigation if needed
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isAuthenticated');
    }
    this.router.navigate(['/login']);
  }

  getEmployeeDetails(): void {
    this.employeeService.getEmployeeDetails().subscribe({
      next: (response) => {
        if (response) {
          this.employeeName = response.name || response.username || 
            (isPlatformBrowser(this.platformId) ? localStorage.getItem('username') : null) || 
            'Employee';
          this.employeeSkill = response.skill || '';
          this.employeeStatus = response.status || 'Active';
        }
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
        if (isPlatformBrowser(this.platformId)) {
          this.employeeName = localStorage.getItem('username') || 'Employee';
        } else {
          this.employeeName = 'Employee';
        }
      }
    });
  }

  getEmployeeTasks(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeTasks().subscribe({
      next: (response) => {
        if (response && response.projects) {
          this.projectsWithTasks = response.projects;
          
          // Process tasks
          this.activeTasksCount = 0;
          this.completedTasksCount = 0;
          let allTasks: Task[] = [];
          
          this.projectsWithTasks.forEach(project => {
            project.tasks.forEach(task => {
              allTasks.push(task);
              if (task.status === 'Completed') {
                this.completedTasksCount++;
              } else {
                this.activeTasksCount++;
              }
            });
          });
          
          // Get upcoming deadlines
          this.upcomingDeadlines = [...allTasks]
            .filter(task => task.status !== 'Completed' && task.duedate)
            .sort((a, b) => {
              const dateA = a.duedate ? new Date(a.duedate).getTime() : 0;
              const dateB = b.duedate ? new Date(b.duedate).getTime() : 0;
              return dateA - dateB;
            })
            .slice(0, 3);
        } else {
          // Reset values if no data
          this.projectsWithTasks = [];
          this.activeTasksCount = 0;
          this.completedTasksCount = 0;
          this.upcomingDeadlines = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching employee tasks:', error);
        this.isLoading = false;
        // Reset values on error
        this.projectsWithTasks = [];
        this.activeTasksCount = 0;
        this.completedTasksCount = 0;
        this.upcomingDeadlines = [];
      }
    });
  }

  getTaskType(description: string, taskType: string | null): string {
    return taskType || 'General Task';
  }

  formatDate(date: string): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  }

  updateTaskStatus(taskId: number, status: string): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    this.employeeService.updateTaskStatus(taskId, status).subscribe({
      next: () => {
        this.getEmployeeTasks();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.isUpdating = false;
      }
    });
  }

  applyForLeave(): void {
    // Implement leave application logic
    alert('Leave application feature coming soon!');
  }
}
