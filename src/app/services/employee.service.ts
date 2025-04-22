import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://127.0.0.1:8000/api/';
  private employeesUrl = `${this.baseUrl}employee/all/`;
  private detailsUrl = `${this.baseUrl}employee/details/`;  // Changed back to original endpoint
  private tasksUrl = `${this.baseUrl}employee/tasks/`;
  private updateTaskUrl = `${this.baseUrl}tasks/`;

  constructor(private http: HttpClient) {}

  // Helper method to create headers with authentication
  private getHeaders(): HttpHeaders {
    const username = localStorage.getItem('username');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (username) {
      headers = headers.set('X-Username', username);
    }
    
    return headers;
  }

  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.employeesUrl, { 
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getEmployeeDetails(): Observable<any> {
    return this.http.get<any>(this.detailsUrl, { 
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getEmployeeTasks(): Observable<any> {
    return this.http.get<any>(this.tasksUrl, { 
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  // Update the updateTaskStatus method to use a simpler approach
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    const url = `${this.baseUrl}tasks/${taskId}/update-status/`;
    return this.http.put(url, { status }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  applyForLeave(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}employee/apply-leave/`, 
      {}, 
      { 
        headers: this.getHeaders(),
        withCredentials: true
      }
    );
  }
}
