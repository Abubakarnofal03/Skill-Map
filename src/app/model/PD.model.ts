import { task } from "./task.model";
import {TeamMember} from "./teammember.model"
export interface PD {
    id?: number;
    name: string;
    description: string;
    type: string;
    startdate?:Date;
    enddate?:Date;
    status?:string;
    tasks?: task[];
    teammembers?:TeamMember[];
  }
  



 