import { Component, OnInit, signal } from '@angular/core';
import { EmployeeModel } from '../../model/employee-model';
import { DepartmentModel } from '../../model/department-model';
import { DesignationModel } from '../../model/designation-model';
import { EmployeeService } from '../../services/employee-service';
import { DepartmentService } from '../../services/department-service';
import { DesignationService } from '../../services/designation-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee.html',
})
export class Employee implements OnInit {
  employee = signal(new EmployeeModel());
  editMode = signal(false);

  employees = signal<EmployeeModel[]>([]);
  activeEmployees = signal<EmployeeModel[]>([]);
  inactiveEmployees = signal<EmployeeModel[]>([]);

  departments = signal<DepartmentModel[]>([]);
  designations = signal<DesignationModel[]>([]);
  filteredDesignations = signal<DesignationModel[]>([]);

  constructor(
    private empService: EmployeeService,
    private deptService: DepartmentService,
    private desgService: DesignationService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();

    this.empService.getAll().subscribe(data => {
      this.employees.set(data);
      this.filterEmployees();
    });
  }

  loadInitialData(): void {
    this.deptService.getAll().subscribe({
      next: depts => {
        this.departments.set(depts);

        this.desgService.getAll().subscribe({
          next: desgs => {
            this.designations.set(desgs);

            if (this.editMode() && this.employee().department) {
              this.onDepartmentChange(this.employee().department);
            }
          },
        });
      },
    });
  }

  updateField(field: string, value: any) {
    this.employee.update(emp => ({ ...emp, [field]: value }));
  }

// department select হলে filteredDesignation update হবে
onDepartmentChange(dept: DepartmentModel | undefined): void {
  if (!dept) {
    this.filteredDesignations.set([]); // reset
    this.employee.update(e => ({ ...e, designation: undefined }));
    return;
  }

  const dId = dept.id;
  const filtered = this.designations().filter(d => d.departmentId === dId);
  this.filteredDesignations.set(filtered);

  // editMode না হলে designation reset
  if (!this.editMode()) {
    this.employee.update(e => ({ ...e, designation: undefined }));
  }
}


  compareDepts(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  compareDesgs(d1: any, d2: any): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

save(): void {
  const emp = this.employee(); // get current employee value
  if (this.editMode() && emp.id !== undefined) { 
    this.empService.update(emp.id, emp).subscribe({
      next: (updatedEmp) => {
        alert("Update successful");

        // update employees list
        this.employees.update(list => list.map(e => e.id === updatedEmp.id ? updatedEmp : e));

        // update active / inactive tables
        this.filterEmployees();

        this.editMode.set(false); 
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert("Update failed!");
      }
    });
  } else {
    this.empService.create(emp).subscribe({
      next: (newEmp) => {
        alert("Added successfully");

        // add new employee
        this.employees.update(list => [...list, newEmp]);

        // update active / inactive tables
        this.filterEmployees();

        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert("Add failed!");
      }
    });
  }
}






  edit(emp: EmployeeModel): void {
    this.editMode.set(true);
    this.employee.set(JSON.parse(JSON.stringify(emp)));

    if (this.employee().department) {
      this.onDepartmentChange(this.employee().department);
    }
  }

delete(id: number | undefined): void {
  if (!id) {
    alert("Error: Employee ID missing!");
    return;
  }

  if (confirm("Are you sure you want to delete this employee?")) {
    this.empService.delete(id).subscribe({
      next: () => {
        alert("Employee deleted successfully!");
        // employees signal update
        this.employees.set(this.employees().filter(e => e.id !== id));
        this.filterEmployees();
      },
      error: (err) => console.error(err)
    });
  }
}




  filterEmployees(): void {
    this.activeEmployees.set(this.employees().filter(e => e.status === 'ACTIVE'));
    this.inactiveEmployees.set(this.employees().filter(e => e.status === 'INACTIVE'));
  }

  resetForm(): void {
    this.employee.set(new EmployeeModel());
    this.filteredDesignations.set([]);
    this.editMode.set(false);
  }

  refreshTables(): void {
    this.empService.getAll().subscribe({
      next: data => {
        this.employees.set(data);
        this.filterEmployees();
      },
    });
  }

  downloadEmployeeReport() {
    this.empService.getEmployeeReport().subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'EmployeeReport.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Download failed', err);
        alert('Report download failed!');
      },
    });
  }
}
