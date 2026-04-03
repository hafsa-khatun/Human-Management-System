import { Component, OnInit, signal } from '@angular/core';
import { LeaveModel } from '../../model/leave-model';
import { LeaveService } from '../../services/leave-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration-service';
import { RegistrationModel } from '../../model/registration-model';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './leave.html',
  styleUrls: ['./leave.scss']
})
export class Leave implements OnInit {
  leaveForm = signal<LeaveModel>({
    leaveType: '',
    startDate: '',
    endDate: '',
    status: '',
    registration: { id: 0 }
  });

  selectedRegistrationId: number | null = null;
  editingId = signal<number | null>(null);

  constructor(
    public leaveService: LeaveService,
    public registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.registrationService.loadRegistrations();
    this.leaveService.loadLeaves();
  }

  onRegistrationChange(): void {
    if (!this.selectedRegistrationId) {
      this.leaveService.leaves.set([]);
      return;
    }
    this.leaveService.getLeavesByRegistrationId(this.selectedRegistrationId);
  }

  saveLeave(): void {
    if (!this.selectedRegistrationId) {
      alert('Please select a registration');
      return;
    }

    const leaveToSave: LeaveModel = {
      ...this.leaveForm(),
      registration: { id: this.selectedRegistrationId }
    };

    // Edit mode check
    if (this.editingId()) {
      this.leaveService.updateLeave(this.editingId()!, leaveToSave)
        .subscribe({
          next: updatedLeave => {
            alert('Leave updated successfully');

            // update leaves signal
            this.leaveService.leaves.update(list => 
              list.map(l => l.id === updatedLeave.id ? updatedLeave : l)
            );

            this.resetForm();
          },
          error: err => {
            console.error(err);
            alert('Update failed');
          }
        });
    } else {
      this.leaveService.createLeave(leaveToSave)
        .subscribe({
          next: newLeave => {
            alert('Leave added successfully');

            // add to leaves signal
            this.leaveService.leaves.update(list => [...list, newLeave]);

            this.resetForm();
          },
          error: err => {
            console.error(err);
            alert('Add failed');
          }
        });
    }
  }

  editLeave(leave: LeaveModel): void {
    this.leaveForm.set({ ...leave });
    this.editingId.set(leave.id!);
    this.selectedRegistrationId = leave.registration.id;

    // Load leaves for selected registration
    this.leaveService.getLeavesByRegistrationId(this.selectedRegistrationId);
  }

  deleteLeave(id: number): void {
    if (!confirm('Are you sure to delete this leave?')) return;

    this.leaveService.deleteLeave(id).subscribe({
      next: () => {
        alert('Leave deleted successfully');

        // remove from signal
        this.leaveService.leaves.update(list => list.filter(l => l.id !== id));

        this.resetForm();
      },
      error: err => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

  resetForm(): void {
    this.leaveForm.set({
      leaveType: '',
      startDate: '',
      endDate: '',
      status: '',
      registration: { id: 0 }
    });
    this.selectedRegistrationId = null;
    this.editingId.set(null);
  }
}
