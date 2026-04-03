import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training-service';
import { TrainingModel } from '../../model/training-moel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './training.html',
  styleUrl: './training.scss',
})
export class Training implements OnInit {
  private fb = inject(FormBuilder);
  private trainingService = inject(TrainingService);

  // Use Signal for instant UI updates
  trainings = signal<TrainingModel[]>([]);
  trainingForm: FormGroup;
  isEditMode: boolean = false;
  editTrainingId: number | null = null;

  constructor() {
    this.trainingForm = this.fb.group({
      trainingTitle: ['', Validators.required],
      trainerName: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: [''],
      certificateNumber: [''],
      issueDate: [''],
      grade: ['']
    });
  }

  ngOnInit(): void {
    this.loadTrainings();
  }

loadTrainings() {
  this.trainingService.getAllTrainings().subscribe({
    next: (data) => {
    
      const sortedData = data.sort((a, b) => a.trainingTitle.localeCompare(b.trainingTitle));
      this.trainings.set(sortedData);
    },
    error: err => console.error('Load error:', err)
  });
}

onSubmit() {
  if (this.trainingForm.invalid) {
    alert("Please fill all required fields!"); // ভ্যালিডেশন এরর মেসেজ
    return;
  }

  const training: TrainingModel = this.trainingForm.value;

  if (this.isEditMode && this.editTrainingId != null) {
    // Update logic
    this.trainingService.updateTraining(this.editTrainingId, training).subscribe({
      next: () => {
        alert("Training updated successfully!"); // আপডেট সাকসেস মেসেজ
        this.loadTrainings();
        this.resetForm();
      },
      error: (err) => {
        console.error('Update error:', err);
        alert("Failed to update training.");
      }
    });
  } else {
    // Create logic
    this.trainingService.createTraining(training).subscribe({
      next: () => {
        alert("Training saved successfully!"); // সেভ সাকসেস মেসেজ
        this.loadTrainings();
        this.resetForm();
      },
      error: (err) => {
        console.error('Create error:', err);
        alert("Failed to save training.");
      }
    });
  }
}

  editTraining(training: TrainingModel) {
    this.isEditMode = true;
    this.editTrainingId = training.id || null;
    this.trainingForm.patchValue(training);
  }

  // FIXED DELETE LOGIC: Instant removal
  deleteTraining(id: number) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.trainingService.deleteTraining(id).subscribe({
      next: () => {
        // Option 1: Instant local update
        this.trainings.update(list => list.filter(t => t.id !== id));
        
        if (this.editTrainingId === id) this.resetForm();
      },
      error: (err) => {
        // Option 2: Handle cases where backend returns text instead of JSON
        if (err.status === 200) {
          this.trainings.update(list => list.filter(t => t.id !== id));
        } else {
          console.error('Delete error:', err);
        }
      }
    });
  }

  resetForm() {
    this.trainingForm.reset();
    this.isEditMode = false;
    this.editTrainingId = null;
  }

  downloadTrainingReport() {
    this.trainingService.downloadTrainingReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Training_Report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}