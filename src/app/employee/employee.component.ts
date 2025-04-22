import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { LocalStorageService } from '../services/local-storage.service';
import { HttpHeaders } from '@angular/common/http';

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
  isUpdating: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router, 
    private employeeService: EmployeeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const isAuthenticated = this.localStorageService.getItem('isAuthenticated');
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return;
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
    this.localStorageService.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  private getEmployeeDetails(): void {
    const username = this.localStorageService.getItem('username');
    if (username) {
      this.employeeName = username;
      
      // Get employee details from service
      this.employeeService.getEmployeeDetails().subscribe(
        (data) => {
          if (data) {
            this.employeeSkill = data.skill || '';
            this.employeeStatus = data.status || 'Active';
          }
        },
        (error) => {
          console.error('Error fetching employee details:', error);
        }
      );
    }
  }

  private getEmployeeTasks(): void {
    this.isLoading = true;
    
    this.employeeService.getEmployeeTasks().subscribe(
      (response) => {
        this.projectsWithTasks = response.projects || [];
        this.calculateTaskMetrics();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching employee tasks:', error);
        this.isLoading = false;
      }
    );
  }

  private calculateTaskMetrics(): void {
    this.activeTasksCount = 0;
    this.completedTasksCount = 0;
    this.upcomingDeadlines = [];
    
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);
    
    this.projectsWithTasks.forEach(project => {
      project.tasks.forEach(task => {
        // Count active and completed tasks
        if (task.status === 'In Progress' || task.status === 'Pending') {
          this.activeTasksCount++;
        } else if (task.status === 'Completed') {
          this.completedTasksCount++;
        }
        
        // Check for upcoming deadlines (within a week)
        const dueDate = new Date(task.duedate);
        if (dueDate >= today && dueDate <= oneWeekLater && task.status !== 'Completed') {
          this.upcomingDeadlines.push(task);
        }
      });
    });
    
    // Sort upcoming deadlines by due date
    this.upcomingDeadlines.sort((a, b) => {
      return new Date(a.duedate).getTime() - new Date(b.duedate).getTime();
    });
  }

  updateTaskStatus(taskId: number, newStatus: string): void {
    this.isUpdating = true;
    
    this.employeeService.updateTaskStatus(taskId, newStatus).subscribe(
      (response) => {
        // Update the task status in the local data
        this.projectsWithTasks.forEach(project => {
          const task = project.tasks.find(t => t.id === taskId);
          if (task) {
            task.status = newStatus;
          }
        });
        
        this.calculateTaskMetrics();
        this.isUpdating = false;
      },
      (error) => {
        console.error('Error updating task status:', error);
        this.isUpdating = false;
      }
    );
  }

  getTaskStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getTaskType(description: string, tasktype: string | null): string {
    return tasktype || description;  // Return tasktype if available, otherwise description
  }

  applyForLeave(): void {
    // Implement leave application logic here
    console.log('Leave application functionality to be implemented');
  }
}
