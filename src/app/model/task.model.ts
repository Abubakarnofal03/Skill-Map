import { TeamMember } from "./teammember.model";

export interface task {
  id?: number; // Add this line
  title?: string;
  status?: string;
  description: string;
  assignedmember?: string; // Deprecated, use assigned_to instead
  assigned_to?: TeamMember | null; // Add this line
  duedate?: Date;
  showDropdown?: boolean;
  designation?: string; // Change from string[] to string
}