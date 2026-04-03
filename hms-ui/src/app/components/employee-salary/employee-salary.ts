import { Component, OnInit, signal } from '@angular/core';
import { SalaryModel } from '../../model/salary-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalaryService } from '../../services/salary-service';
import { EmployeeModel } from '../../model/employee-model';
import { EmployeeService } from '../../services/employee-service';

@Component({
  selector: 'app-employee-salary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-salary.html',
  styleUrl: './employee-salary.scss',
})
export class EmployeeSalary implements OnInit {

  // ✅ Signals
  employees = signal<EmployeeModel[]>([]);
  salaries = signal<SalaryModel[]>([]);
  salaryForm = signal<SalaryModel>(new SalaryModel());
  editingId = signal<number | null>(null);
  showForm = signal(false);

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.getAllSalary();
    this.getAllEmployees();
  }

  // ================= Employees =================
  getAllEmployees() {
    this.employeeService.getAll().subscribe(res => {
      this.employees.set(res);
    });
  }

  // ================= Salaries =================
  getAllSalary() {
    this.salaryService.getAll().subscribe(res => {
      this.salaries.set(res);

      if (!this.editingId()) {
        this.generateSalaryCode();
      }
    });
  }

  // ================= Employee Change =================
  onEmployeeChange(employeeId: number) {
    const emp = this.employees().find(e => e.id == employeeId);
    if (!emp) return;

    this.salaryForm.update(f =>
      Object.assign(new SalaryModel(), f, {
        employeeId: emp.id,
        name: emp.fullName,
        phone: emp.phone,
        basicSalary: emp.salary
      })
    );
  }

  // ================= Salary Code =================
  generateSalaryCode() {
    const list = this.salaries();
    let next = 1;

    if (list.length > 0) {
      const last = list[list.length - 1].salaryCode;
      const num = Number(last.split('-')[1]);
      next = num + 1;
    }

    this.salaryForm.update(f =>
      Object.assign(new SalaryModel(), f, {
        salaryCode: 'SAL-' + next.toString().padStart(4, '0')
      })
    );
  }

  // ================= Save =================
  saveSalary() {
    const form = this.salaryForm();

    if (!form.salaryCode?.trim()) {
      alert('Salary Code required');
      return;
    }

    if (!form.employeeId) {
      alert('Please select employee');
      return;
    }

    if (this.editingId()) {
      this.salaryService.update(this.editingId()!, form).subscribe(() => {
        alert('Salary Updated Successfully');
        this.afterSave();
      });
    } else {
      this.salaryService.create(form).subscribe(() => {
        alert('Salary Saved Successfully');
        this.afterSave();
      });
    }
  }

  // ================= After Save =================
  afterSave() {
    this.resetForm();
    this.getAllSalary();
    this.showForm.set(false);
  }

  // ================= Edit =================
  editSalary(s: SalaryModel) {
    this.salaryForm.set(Object.assign(new SalaryModel(), s));
    this.editingId.set(s.id!);
    this.showForm.set(true);
  }

  // ================= Delete =================
  deleteSalary(id: number) {
    if (confirm('Are you sure to delete this salary?')) {
      this.salaryService.delete(id).subscribe(() => {
        this.salaries.update(list => list.filter(s => s.id !== id));
        alert('Salary Deleted Successfully!');
      });
    }
  }

  // ================= Reset =================
  resetForm() {
    this.salaryForm.set(new SalaryModel());
    this.editingId.set(null);
  }

}
