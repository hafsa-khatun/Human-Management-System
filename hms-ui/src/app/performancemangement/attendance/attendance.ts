import { Component, inject, OnInit, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendence-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AttendanceReportModel, AttendanceStatus } from '../../model/attendence-model';
import { StatusFilterPipe } from '../../pipes/status-filter.pipe';
import { EmployeeModel } from '../../model/employee-model';
import { EmployeeService } from '../../services/employee-service';


@Component({
  selector: 'app-attendance',
  imports: [FormsModule,CommonModule,StatusFilterPipe],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance implements OnInit{
  attendanceList: any;  

  employees: EmployeeModel[] = [];

  newAttendance: AttendanceReportModel = {
    employeeCode: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    inTime: '09:00',
    outTime: '17:00',
    status: AttendanceStatus.PRESENT
  };

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService
  ) {
    // 👇 এখানে initialize করো
    this.attendanceList = this.attendanceService.attendanceList;
  }

  ngOnInit(): void {
    this.attendanceService.loadAll();

    this.employeeService.getAll().subscribe(data => {
      this.employees = data;
    });
  }

  setEmployeeName() {
    const emp = this.employees.find(e => e.id == Number(this.newAttendance.employeeCode));
    if (emp) {
      this.newAttendance.employeeName = emp.fullName;
    }
  }

  add() {
    this.attendanceService.create(this.newAttendance).subscribe(() => {
      alert('Attendance added successfully');

      this.newAttendance = {
        employeeCode: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        inTime: '09:00',
        outTime: '17:00',
        status: AttendanceStatus.PRESENT
      };
    });
  }

  update(report: AttendanceReportModel) {
    this.attendanceService.update(report.id!, report).subscribe(() => {
      alert('Attendance updated successfully');
    });
  }

  delete(id: number) {
    this.attendanceService.delete(id).subscribe(() => {
      alert('Attendance deleted successfully');
    });
  }
}
