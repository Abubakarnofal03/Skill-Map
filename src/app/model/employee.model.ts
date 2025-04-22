export interface Employee {
    name: string;
    photo: string;
    status: 'Free' | 'Busy' | 'on leave';
    rating: number; // percentage
    projectsDone: number;
  }
  