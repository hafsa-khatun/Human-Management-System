import { DepartmentModel } from './department-model';
import { DesignationModel } from './designation-model';

export class EmployeeModel {
  id?: number;
  fullName: string = '';
  email: string = '';
  phone: string = '';
  gender: string = '';
  employeeType: string = '';
  salary: number = 0;
  status: string = 'ACTIVE';

  department?: DepartmentModel; 
  designation?: DesignationModel;
}