import { Component, effect, OnInit, signal } from '@angular/core';
import { RegistrationModel } from '../../model/registration-model';
import { RegistrationService } from '../../services/registration-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [FormsModule,CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration implements OnInit{
  // Signal for registration form
  registrationForm = signal<RegistrationModel>({
    name: '',
    phone: '',
    reason: ''
  });

  // Editing id
  editingId = signal<number | null>(null);

  constructor(public registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.registrationService.loadRegistrations();
  }

  // Save or update
  saveRegistration() {
    if (this.editingId()) {
      // Update
      this.registrationService.updateRegistration(
        this.editingId()!,
        this.registrationForm()
      ).subscribe(() => {
        
        this.resetForm();
        this.registrationService.loadRegistrations();
      });
    } else {
      // Create
      this.registrationService.createRegistration(
        this.registrationForm()
      ).subscribe(() => {
        alert("Registration Successfully");
        this.resetForm();
        this.registrationService.loadRegistrations();
      });
    }
  }

  // Edit
  editRegistration(reg: RegistrationModel) {
    this.registrationForm.set({ ...reg });
    this.editingId.set(reg.id!);
  }

  // Delete with confirmation
  deleteRegistration(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this registration?');
    if (confirmDelete) {
      this.registrationService.deleteRegistration(id)
        .subscribe(() => this.registrationService.loadRegistrations());
    }
  }

  // Reset form
  resetForm() {
    this.registrationForm.set({ name: '', phone: '', reason: '' });
    this.editingId.set(null);
  }
}

