// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { PD } from '../model/PD.model';
// import { ProjectService } from '../services/project.service';

// @Component({
//   selector: 'app-project',
//   templateUrl: './project.component.html',
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   selectedOption: string = ''; // To track the selected option
//   isAddProjectModalOpen: boolean = false; // Modal visibility flag
  
//   // Array of projects (updated with dummy data)
//   projects: PD[] = [
//     {
//       name: 'Project Alpha',
//       description: 'Developing a responsive UI for a client dashboard.',
//       type: 'UI Design',
//       startdate: new Date('2023-01-15'),
//       enddate: new Date('2023-03-30'),
//       status: 'Completed',
//       tasks: [
//         { title: 'Create wireframes', status: 'Completed', description: 'Design low-fidelity wireframes' },
//         { title: 'Design mockups', status: 'Completed', description: 'Create high-fidelity designs' },
//         { title: 'Create wireframes', status: 'Completed', description: 'Design low-fidelity wireframes' },
//         { title: 'Design mockups', status: 'Completed', description: 'Create high-fidelity designs' },
//         { title: 'Create wireframes', status: 'Completed', description: 'Design low-fidelity wireframes' },
//         { title: 'Design mockups', status: 'Completed', description: 'Create high-fidelity designs' },
//         { title: 'Create wireframes', status: 'Completed', description: 'Design low-fidelity wireframes' },
//         { title: 'Design mockups', status: 'Completed', description: 'Create high-fidelity designs' }
//       ],
//       teammembers: [
//         { name: 'Alice', skill: 'Frontend', status: 'Available' },
//         { name: 'Bob', skill: 'UX Designer', status: 'Busy' }
//       ]
//     },
//     {
//       name: 'Project Beta',
//       description: 'Backend development for an e-commerce application.',
//       type: 'Backend Development',
//       startdate: new Date('2023-04-01'),
//       enddate: new Date('2023-06-15'),
//       status: 'In Progress',
//       tasks: [
//         { title: 'Set up database schema', status: 'In Progress', description: 'Design database structure' },
//         { title: 'Implement API endpoints', status: 'Pending', description: 'Develop RESTful APIs' }
//       ],
//       teammembers: [
//         { name: 'Charlie', skill: 'Backend Developer', status: 'Busy' },
//         { name: 'Diana', skill: 'Database Administrator', status: 'Available' }
//       ]
//     },
//     {
//       name: 'Project Gamma',
//       description: 'Integrating a machine learning model into a web application.',
//       type: 'Machine Learning',
//       startdate: new Date('2023-07-01'),
//       enddate: new Date('2023-09-30'),
//       status: 'Pending',
//       tasks: [
//         { title: 'Collect training data', status: 'Pending', description: 'Gather and clean data' },
//         { title: 'Train model', status: 'Pending', description: 'Build and train ML model' }
//       ],
//       teammembers: [
//         { name: 'Eve', skill: 'Data Scientist', status: 'Available' },
//         { name: 'Frank', skill: 'ML Engineer', status: 'Busy' }
//       ]
//     }
//   ];

//   // newProject will hold the data for the project being added
//   newProject: PD = {
//     name: '',
//     description: '',
//     type: '',
//     startdate: new Date(),
//     enddate: new Date(),
//     status: 'Pending',
//     tasks: [],
//     teammembers: []
//   };

//   constructor(private router: Router, private projectservice: ProjectService) {}

//   ngOnInit(): void {}

//   navigateTo(page: string): void {
//     this.selectedOption = page; // Set the selected option when clicked
//     if (page === 'teams') {
//       this.projectservice.setProjects(this.projects); // Store projects in the service
//       this.router.navigate(['/teams']);
//     } else {
//       this.router.navigate([`/${page}`]);
//     }
//   }

//   viewProjectDetails(project: PD): void {
//     this.router.navigate(['/projectdetails'], { state: { project } });
//   }

//   logout(): void {
//     localStorage.setItem('isAuthenticated','false');
//     this.router.navigate(['/login2']);
//   }

//   openAddProjectForm(): void {
//     this.isAddProjectModalOpen = true; // Show modal
//   }

//   closeAddProjectForm(): void {
//     this.isAddProjectModalOpen = false; // Hide modal
//   }

//   addProject(): void {
//     if (this.newProject.name && this.newProject.description && this.newProject.type) {
//       this.projects.push({ ...this.newProject }); // Add new project
//       this.closeAddProjectForm();
//       console.log("Project added: ", this.newProject);
//       this.newProject = { name: '', description: '', type: '', startdate: new Date(), enddate: new Date(), status: 'Pending', tasks: [], teammembers: [] };
//     }
//   }
// }


// project.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PD } from '../model/PD.model';
import { ProjectService } from '../services/project.service';
import { style } from '@angular/animations';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  selectedOption: string = ''; 
  isAddProjectModalOpen: boolean = false; 
  projects: PD[] = [];
  nameError = false;
  descriptionError = false;
  typeError=false;

  newProject: PD = {
    name: '',
    description: '',
    type: '',
    startdate: new Date(),
    enddate: new Date(),
    status: 'Pending',
    tasks: [],
    teammembers: []
  };

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }


  navigateTo(page: string): void {
    this.selectedOption = page; // Set the selected option when clicked
    if (page === 'teams') {
      this.projectService.setProjects(this.projects); // Store projects in the service
      this.router.navigate(['/teams']);
    } else {
      this.router.navigate([`/${page}`]);
    }
  }
  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  viewProjectDetails(project: PD): void {
    this.router.navigate(['/projectdetails'], { state: { project } });
  }


  logout(): void {
    localStorage.setItem('isAuthenticated','false');
    this.router.navigate(['/login2']);
  }
  openAddProjectForm(): void {
    this.isAddProjectModalOpen = true;
  }

  dateError: string | null = null;

  validateDates(): void {
    if (!this.newProject.startdate || !this.newProject.enddate) {
        this.dateError = null; // No error if either date is missing
        return;
    }

    const startDate = new Date(this.newProject.startdate);
    const endDate = new Date(this.newProject.enddate);

    if (startDate > endDate) {
        this.dateError = 'Start date cannot be after the end date.';
    } else {
        this.dateError = null;
    }
}

  
  closeAddProjectForm(): void {
      this.isAddProjectModalOpen = false;
      this.dateError = null; // Reset error when closing form
      this.resetErrors();  // Reset other errors if any
  }
  

  addProject(): void {
    // Reset error flags
    this.resetErrors();

    // Validate name and description are not numbers
    if (this.isNumeric(this.newProject.name)) {
      this.nameError = true;
      return;
    }

    if (this.isNumeric(this.newProject.description)) {
      this.descriptionError = true;
      return;
    }
    if (this.isNumeric(this.newProject.type)) {
      this.typeError = true;
      return;
    }

    if (this.newProject.name && this.newProject.description && this.newProject.type) {
      this.projectService.addProject(this.newProject).subscribe((project) => {
        this.projects.push(project);
        this.closeAddProjectForm();
        this.newProject = { name: '', description: '', type: '', startdate: new Date(), enddate: new Date(), status: 'Pending', tasks: [], teammembers: [] };
      });
    }
  }

  // Helper function to check if a string is numeric
  isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== '';
  }

  // Reset error flags
  resetErrors(): void {
    this.nameError = false;
    this.descriptionError = false;
  }
}

