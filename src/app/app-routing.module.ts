// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { ProjectComponent } from './project/project.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { AuthGuard } from '../auth.guard';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login2', component: Login2Component },
  { path: 'project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'projectdetails', component: ProjectdetailsComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'teams', component: TeamsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path:'employee',component:EmployeeComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
