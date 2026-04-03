import { Component, OnInit, signal, inject } from '@angular/core';
import { LeaveRequestModel } from '../../model/leave-request-model';
import { LeaveRequestService } from '../../services/leave-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeModel } from '../../model/employee-model';
import { EmployeeService } from '../../services/employee-service';
import { AuthService } from '../../services/auth.service'; // Added

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request.html',
  styleUrls: ['./leave-request.scss'],
})
export class LeaveRequest implements OnInit {
  // Services
  private service = inject(LeaveRequestService);
  private employeeService = inject(EmployeeService);
  public authService = inject(AuthService); // Added to check role

  leaveList = signal<LeaveRequestModel[]>([]);
  employees = signal<EmployeeModel[]>([]);
  filterStatus = signal<'' | 'PENDING' | 'APPROVED' | 'REJECTED'>('');

  newLeave = signal<LeaveRequestModel>({
    employeeCode: '',
    employeeName: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    leaveProposal: '',
    status: 'PENDING',
  });

  ngOnInit() {
    this.service.leaveList$.subscribe(list => this.leaveList.set(list));
    this.service.loadAll();
    this.employeeService.getAll().subscribe(data => this.employees.set(data));
  }

  // ---------------- Filter ----------------
  showAll() { this.filterStatus.set(''); }
  showPending() { this.filterStatus.set('PENDING'); }
  showApproved() { this.filterStatus.set('APPROVED'); }
  showRejected() { this.filterStatus.set('REJECTED'); }

  filteredList(): LeaveRequestModel[] {
    const status = this.filterStatus();
    if (!status) return this.leaveList();
    return this.leaveList().filter(l => l.status === status);
  }

  // ---------------- Employee Selection ----------------
  onEmployeeCodeChange(code: string) {
    const emp = this.employees().find(e => e.id?.toString() === code);
    this.newLeave.update(nl => ({
      ...nl,
      employeeCode: code,
      employeeName: emp ? emp.fullName : ''
    }));
  }

  // ---------------- Leave Actions ----------------
  apply() {
    const leaveData: LeaveRequestModel = {
      ...this.newLeave(),
      status: 'PENDING'
    };

    this.service.applyLeave(leaveData).subscribe({
      next: () => {
        alert('Leave request submitted ✅');
        this.service.loadAll();
        // Reset form
        this.newLeave.set({
          employeeCode: '',
          employeeName: '',
          leaveType: '',
          startDate:'',
          endDate: '',
          reason: '',
          leaveProposal: '',
          status: 'PENDING',
        });
      },
      error: () => alert('Error ❌')
    });
  }

  approve(id: number) {
    this.service.approveLeave(id).subscribe({
      next: () => alert('Leave approved ✅'),
      error: () => alert('Error ❌')
    });
  }

  reject(id: number) {
    this.service.rejectLeave(id).subscribe({
      next: () => alert('Leave rejected ❌'),
      error: () => alert('Error ❌')
    });
  }

  deleteLeave(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteLeave(id).subscribe({
        next: () => {
          alert('Deleted successfully ✅');
          this.service.loadAll();
        },
        error: () => alert('Delete failed ❌')
      });
    }
  }
}