import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedOption: string = '';
  employees: any[] = [];
  filteredEmployees: any[] = [];
  projects: any[] = [];

  searchQuery: string = '';
  pages = [1, 2, 3, 4, 5, 6, 7];
  currentPage = 1;

  totalEmployees: number = 0;
  totalProjects: number = 0;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getProjects();
  }

  getEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.totalEmployees = data.length;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  getProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
        this.totalProjects = data.length;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  filterEmployees(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredEmployees = query
      ? this.employees.filter(employee =>
          employee.username.toLowerCase().includes(query)
        )
      : this.employees;
  }

  navigateTo(page: string): void {
    this.selectedOption = page;
    this.router.navigate([`/${page}`]);
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login2']);
  }
}
