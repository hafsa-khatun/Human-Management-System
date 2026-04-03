import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee-service';
import { LeaveRequestService } from '../../services/leave-request.service';
import { PerformanceService } from '../../services/performance-service';
import { ApplicantService } from '../../services/applicant-service'; // Added
import { TrainingService } from '../../services/training-service';   // Added

interface DepartmentStat {
  name: string;
  count: number;
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private empService = inject(EmployeeService);
  private leaveService = inject(LeaveRequestService);
  private performanceService = inject(PerformanceService);
  private applicantService = inject(ApplicantService); // Injected
  private trainingService = inject(TrainingService);   // Injected

  // Stats Signals
  totalEmployees = signal(0);
  activeEmployees = signal(0);
  inactiveEmployees = signal(0);
  approvedLeaves = signal(0);
  performanceCount = signal(0);
  applicantCount = signal(0); // Added
  trainingCount = signal(0);   // Added
  
  // Department & UI Signals
  departmentStats = signal<DepartmentStat[]>([]);
  loading = signal(true);

  private deptColors = ['#4f46e5', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // 1. Employee & Department Data
    this.empService.getAll().subscribe({
      next: (employees) => {
        this.totalEmployees.set(employees.length);
        this.activeEmployees.set(employees.filter(e => e.status === 'ACTIVE').length);
        this.inactiveEmployees.set(employees.filter(e => e.status === 'INACTIVE').length);

        const deptMap = new Map<string, number>();
        employees.forEach(emp => {
          const name = emp.department?.name || 'Unassigned';
          deptMap.set(name, (deptMap.get(name) || 0) + 1);
        });

        this.departmentStats.set(Array.from(deptMap, ([name, count], i) => ({
          name,
          count,
          color: this.deptColors[i % this.deptColors.length]
        })));

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    // 2. Leave Data
    this.leaveService.leaveList$.subscribe(list => {
      this.approvedLeaves.set(list.filter(l => l.status === 'APPROVED').length);
    });
    this.leaveService.loadAll();

    // 3. Performance Data
    this.performanceService.getAllPerformances().subscribe({
      next: (data) => this.performanceCount.set(data.length),
      error: (err) => console.error('Performance load error:', err)
    });

    // 4. Applicant Data (New)
    this.applicantService.getAllApplicants().subscribe({
      next: (data) => this.applicantCount.set(data.length),
      error: (err) => console.error('Applicant load error:', err)
    });

    // 5. Training Data (New)
    this.trainingService.getAllTrainings().subscribe({
      next: (data) => this.trainingCount.set(data.length),
      error: (err) => console.error('Training load error:', err)
    });
  }

  getPercent(count: number): number {
    const total = this.totalEmployees();
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
}