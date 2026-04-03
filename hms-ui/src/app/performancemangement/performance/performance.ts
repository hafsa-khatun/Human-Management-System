import { Component, OnInit, signal, inject } from '@angular/core';
import { PerformanceModel } from '../../model/performance-model';
import { PerformanceService } from '../../services/performance-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './performance.html',
  styleUrl: './performance.scss',
})
export class Performance implements OnInit {
  private performanceService = inject(PerformanceService);

  // Using Signals for high-performance state management
  performances = signal<PerformanceModel[]>([]);
  editingPerformance = signal<PerformanceModel | null>(null);

  ngOnInit(): void {
    this.loadPerformances();
  }

  loadPerformances(): void {
    this.performanceService.getAllPerformances().subscribe({
      next: (data) => this.performances.set(data),
      error: (err) => console.error('Error fetching performances:', err)
    });
  }

  addNew(): void {
    this.editingPerformance.set({
      employeeId: 0,
      performanceRatting: 0,
      kpiScore: 0,
      annualReview: '',
      promotion: false
    });
  }

  editPerformance(performance: PerformanceModel): void {
    this.editingPerformance.set({ ...performance });
  }

  cancelEdit(): void {
    this.editingPerformance.set(null);
  }

  savePerformance(form: NgForm): void {
    if (!form.valid) return;
    const current = this.editingPerformance();

    if (current && current.id) {
      this.performanceService.updatePerformance(current.id, current).subscribe({
        next: () => {
          this.loadPerformances();
          this.editingPerformance.set(null);
        }
      });
    } else if (current) {
      this.performanceService.addPerformance(current).subscribe({
        next: () => {
          this.loadPerformances();
          this.editingPerformance.set(null);
        }
      });
    }
  }

  deletePerformance(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.performanceService.deletePerformance(id).subscribe({
        next: () => {
          // KEY FIX: Manually update the signal array to reflect changes without reload
          this.performances.update(list => list.filter(item => item.id !== id));
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete operation failed. Please try again.');
        }
      });
    }
  }

  downloadPerformanceReport(): void {
    this.performanceService.getPerformanceReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PerformanceReport.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}