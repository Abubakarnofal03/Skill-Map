// project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PD } from '../model/PD.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8000/api/projects/';  // Your backend URL
  private projects: PD[] = [];

  constructor(private http: HttpClient) {}

  // Fetch projects from the backend
  getProjects(): Observable<PD[]> {
    return this.http.get<PD[]>(this.apiUrl);
  }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  // Store projects in the service
  setProjects(projects: PD[]): void {
    this.projects = projects;
  }

  // Retrieve stored projects
  getStoredProjects(): PD[] {
    return this.projects;
  }

  // Add a new project to the backend
  addProject(project: PD): Observable<PD> {
    return this.http.post<PD>(`${this.apiUrl}add/`, project);
  }

  // Form team for a specific project
  formTeam(projectId: number): Observable<PD> {
    return this.http.post<PD>(
      `${this.apiUrl}${projectId}/team_formation/`,
      {}  
    );
  }

  // Optional: Get single project by ID
  getProject(projectId: number): Observable<PD> {
    return this.http.get<PD>(`${this.apiUrl}${projectId}/`);
  }
}