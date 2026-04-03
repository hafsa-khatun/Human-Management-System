import { Component, OnInit, signal } from '@angular/core';
import { DesignationModel } from '../../model/designation-model';
import { DepartmentModel } from '../../model/department-model';
import { DesignationService } from '../../services/designation-service';
import { DepartmentService } from '../../services/department-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './designation.html',
  styleUrl: './designation.scss',
})
export class Designation implements OnInit {

  // ✅ signals
  designations = signal<DesignationModel[]>([]);
  departments = signal<DepartmentModel[]>([]);
  currentDesg = signal<DesignationModel>(new DesignationModel());
  editMode = signal<boolean>(false);

  constructor(
    private desgService: DesignationService,
    private depService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
    this.loadDepartments();
  }

  loadDesignations(): void {
    this.desgService.getAll().subscribe(res => {
      this.designations.set(res);
    });
  }

  loadDepartments(): void {
    this.depService.getAll().subscribe(res => {
      this.departments.set(res);
    });
  }

  save(): void {
    const data = this.currentDesg();

    if (!data.name || !data.departmentId) return;

    if (this.editMode()) {
      this.desgService.update(data.id, data)
        .subscribe(() => {
          alert("Designation Updated Successfully");
          this.loadDesignations();
          this.cancel();
        });
    } else {
      this.desgService.create(data)
        .subscribe(() => {
          alert("Designation added Successfully");
          this.loadDesignations();
          this.cancel();
        });
    }
  }

  edit(desg: DesignationModel): void {
    const updated = new DesignationModel();
    Object.assign(updated, desg);

    this.currentDesg.set(updated);
    this.editMode.set(true);
  }

  delete(desg: DesignationModel): void {
    if (confirm(`Delete designation "${desg.name}"?`)) {
      this.desgService.delete(desg.id)
        .subscribe(() => {
          alert("Designation deleted Successfully");
          this.loadDesignations();
        });
    }
  }

  cancel(): void {
    this.currentDesg.set(new DesignationModel());
    this.editMode.set(false);
  }

  // ✅ form handlers
  onNameChange(value: string): void {
    this.currentDesg.update(d => {
      d.name = value;
      return d;
    });
  }

  onDepartmentChange(value: number): void {
    this.currentDesg.update(d => {
      d.departmentId = value;
      return d;
    });
  }
}
