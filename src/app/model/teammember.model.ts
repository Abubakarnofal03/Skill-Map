export interface TeamMember {
    id: number;
    name: string;
    skill: string;
    designation: string; // Should match backend values: 'junior_developer', 'mid_developer', 'senior_developer'
    status: string; // Should match backend values: 'busy' | 'free' | 'on_leave'
}