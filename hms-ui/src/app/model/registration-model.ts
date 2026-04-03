import { Leave } from "../employee/leave/leave";


export interface RegistrationModel {
  id?: number;      
  name: string;
  phone: string;
  reason: string;
  leaves?: Leave[];  
}
