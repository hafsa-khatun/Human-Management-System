import { Component, OnInit, signal } from '@angular/core';
import { DepartmentModel } from '../../model/department-model';
import { DepartmentService } from '../../services/department-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-department',
  imports: [FormsModule, CommonModule],
  templateUrl: './department.html',
  styleUrls: ['./department.scss'],
})
export class Department implements OnInit {

  // ✅ signals
  departments = signal<DepartmentModel[]>([]);
  currentDept = signal<DepartmentModel>(new DepartmentModel());
  editMode = signal<boolean>(false);

  constructor(private depService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.depService.getAll().subscribe(res => {
      this.departments.set(res);
    });
  }

  save(): void {
    if (this.editMode()) {
      this.depService.update(this.currentDept().id, this.currentDept())
        .subscribe(() => {
          alert("Department Updated Successfully");
          this.loadDepartments();
          this.cancel();
        });
    } else {
      this.depService.create(this.currentDept())
        .subscribe(() => {
          alert("Department Added Successfully");
          this.loadDepartments();
          this.cancel();
        });
    }
  }

  edit(dep: DepartmentModel): void {
    const updated = new DepartmentModel();
    updated.id = dep.id;
    updated.name = dep.name;
    updated.createdDate = dep.createdDate;

    this.currentDept.set(updated);
    this.editMode.set(true);
  }

  delete(dep: DepartmentModel): void {
    if (confirm(`Delete "${dep.name}"?`)) {
      this.depService.delete(dep.id)
        .subscribe(() => {
          alert("Department Deleted Successfully");
          this.loadDepartments();
        });
    }
  }

  cancel(): void {
    this.currentDept.set(new DepartmentModel());
    this.editMode.set(false);
  }
  onNameChange(value: string): void {
  this.currentDept.update(d => {
    d.name = value;
    return d;
  });
}

}
