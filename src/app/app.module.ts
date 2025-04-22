// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { ProjectComponent } from './project/project.component';
import { FormsModule } from '@angular/forms';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { DashboardComponent } from './dashboard/dashboard.component';  
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { EmployeeComponent } from './employee/employee.component';
import { LocalStorageService } from './services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    Login2Component,
    ProjectComponent,
    ProjectdetailsComponent,
    TasksComponent,
    TeamsComponent,
    DashboardComponent,
    EmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [
    // Use the 'withFetch' method to enable the fetch API
    provideHttpClient(withFetch()),
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
