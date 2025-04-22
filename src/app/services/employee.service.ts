import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api';  // Base URL for the API

  constructor(private http: HttpClient) {}

  getEmployeeDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/details`);
  }

  getEmployeeTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/tasks`);
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`);
  }

  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}/update-status/`, { status });
  }
}
