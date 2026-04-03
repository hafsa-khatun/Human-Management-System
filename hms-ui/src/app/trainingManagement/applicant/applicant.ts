import { Component, OnInit, signal, inject } from '@angular/core';
import { ApplicantModel } from '../../model/applicant-model';
import { ApplicantService } from '../../services/applicant-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applicant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applicant.html',
  styleUrl: './applicant.scss',
})
export class Applicant implements OnInit {
  private applicantService = inject(ApplicantService);

  // Using signals for instant UI updates
  applicants = signal<ApplicantModel[]>([]);

  newApplicant: ApplicantModel = {
    fullName: '',
    email: '',
    phone: ''
  };

  ngOnInit(): void {
    this.loadApplicants();
  }

loadApplicants(): void {
  this.applicantService.getAllApplicants().subscribe({
    next: (data) => {
     
      const sortedData = data.sort((a, b) => a.fullName.localeCompare(b.fullName));
      this.applicants.set(sortedData);
    },
    error: (err) => console.error('Failed to load applicants', err)
  });
}

  addApplicant(): void {
    if (!this.newApplicant.fullName || !this.newApplicant.email || !this.newApplicant.phone) {
      return;
    }

    this.applicantService.createApplicant(this.newApplicant).subscribe({
      next: (res) => {
        this.loadApplicants();
        this.newApplicant = { fullName: '', email: '', phone: '' };
      }
    });
  }

  changeStatus(id: number, status: string): void {
    this.applicantService.updateStatus(id, status).subscribe({
      next: () => {
        // Update status locally without full reload
        this.applicants.update(list => 
          list.map(a => a.id === id ? { ...a, status } : a)
        );
      }
    });
  }

  // FIXED DELETE LOGIC: Instant removal without reload
  deleteApplicant(id: number): void {
    if (confirm('Are you sure to delete this applicant?')) {
      this.applicantService.deleteApplicant(id).subscribe({
        next: () => {
          // Success code runs here
          this.applicants.update(list => list.filter(a => a.id !== id));
        },
        error: (err) => {
          // If backend returns text instead of JSON, check the status
          if (err.status === 200) {
            this.applicants.update(list => list.filter(a => a.id !== id));
          } else {
            console.error('Delete failed', err);
            alert('Could not delete applicant.');
          }
        }
      });
    }
  }

  downloadApplicantReport(): void {
    this.applicantService.downloadApplicantReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Applicant_Report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}