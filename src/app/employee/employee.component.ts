import { Component, OnInit } from '@angular/core';
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
  isUpdating: boolean = false;
  isLoading: boolean = true;

  constructor(
    private router: Router, 
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
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
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }

  // Function to fetch employee details from the backend
  getEmployeeDetails(): void {
    this.employeeService.getEmployeeDetails().subscribe({
      next: (response) => {
        console.log('Employee details response:', response);
        if (response) {
          // Handle different response formats
          this.employeeName = response.name || response.username || localStorage.getItem('username') || 'Employee';
          this.employeeSkill = response.skill || '';
          this.employeeStatus = response.status || 'Active';
        }
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
        // Use username from localStorage as fallback
        this.employeeName = localStorage.getItem('username') || 'Employee';
      }
    });
  }

  // Function to fetch tasks assigned to the employee
  getEmployeeTasks(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeTasks().subscribe({
      next: (response) => {
        console.log('Employee tasks response:', response);
        if (response && response.projects) {
          this.projectsWithTasks = response.projects;
          
          // Process tasks as before
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

  // Function to update task status
  // Update the updateTaskStatus method
  updateTaskStatus(taskId: number, status: string): void {
    this.isUpdating = true;
    
    this.employeeService.updateTaskStatus(taskId, status)
      .subscribe({
        next: (response) => {
          console.log('Task updated successfully:', response);
          
          // Update the task in the local array
          this.projectsWithTasks.forEach(project => {
            project.tasks.forEach(task => {
              if (task.id === taskId) {
                task.status = status;
              }
            });
          });
          
          // Update counts
          this.updateTaskCounts();
          this.isUpdating = false;
        },
        error: (error) => {
          console.error('Error updating task:', error);
          alert('Failed to update task status. Please try again.');
          this.isUpdating = false;
        }
      });
  }

  // Add this method to recalculate task counts
  updateTaskCounts(): void {
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
    
    // Update upcoming deadlines
    this.upcomingDeadlines = [...allTasks]
      .filter(task => task.status !== 'Completed' && task.duedate)
      .sort((a, b) => {
        const dateA = a.duedate ? new Date(a.duedate).getTime() : 0;
        const dateB = b.duedate ? new Date(b.duedate).getTime() : 0;
        return dateA - dateB;
      })
      .slice(0, 3);
  }

  // Helper function to format date
  formatDate(dateString: string): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // Extract task type from description
  // Update the getTaskType method to handle both description and tasktype
  getTaskType(description: string, tasktype: string | null): string {
    if (tasktype) {
      return tasktype;
    }
    
    // Fallback to extracting from description if tasktype is null
    const match = description.match(/Category: (.*)/);
    return match ? match[1] : 'General';
  }

  // Apply for leave functionality
  applyForLeave(): void {
    if (this.employeeStatus === 'on_leave') {
      alert('You are already on leave');
      return;
    }
    
    if (confirm('Are you sure you want to apply for leave?')) {
      this.employeeService.applyForLeave().subscribe(
        (response) => {
          alert('Leave application submitted successfully');
          this.employeeStatus = 'on_leave';
        },
        (error) => {
          console.error('Error applying for leave:', error);
          alert('Failed to apply for leave. Please try again.');
        }
      );
    }
  }
}
