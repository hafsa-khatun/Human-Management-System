import { Component, OnInit } from '@angular/core';
import { PayrollService } from '../../services/payroll.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PayrollProcessingModel } from '../../model/payroll-model';
import { EmployeeModel } from '../../model/employee-model';
import { EmployeeService } from '../../services/employee-service';

@Component({
  selector: 'app-payroll-processing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payroll-processing.html',
  styleUrl: './payroll-processing.scss',
})
export class PayrollProcessing implements OnInit {
  month: string = '';
  payrollList: PayrollProcessingModel[] = [];
  employees: EmployeeModel[] = [];
  processing: boolean = false;

  constructor(
    private payrollService: PayrollService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.getAll().subscribe(data => {
      this.employees = data;
    });
  }

  onMonthChange(): void {
    // শুধু UI refresh এর জন্য
  }

  processPayrollForMonth(): void {
    if (!this.month) {
      alert('Please select a month');
      return;
    }
    
    if (this.processing) return;
    
    this.processing = true;
    this.payrollList = [];

    // ✅ Response কে any হিসাবে নিন
    this.payrollService.processPayroll(this.month).subscribe({
      next: (res: any) => {
        console.log('Response received:', res);
        
      
        if (Array.isArray(res)) {
          this.payrollList = res;
        } 
   
        else if (res && res.data && Array.isArray(res.data)) {
          this.payrollList = res.data;
        }
      
        else if (res && typeof res === 'object') {
          this.payrollList = [res];
        } 
        else {
          this.payrollList = [];
        }
        
        this.processing = false;
        
        if (this.payrollList.length > 0) {
          alert('Payroll processed successfully!');
        } else {
          alert('No payroll data found!');
        }
      },
      error: (err: any) => {
        console.error('Error processing payroll:', err);
        this.payrollList = [];
        this.processing = false;
        alert('Error: ' + (err.error?.message || err.message || 'Something went wrong'));
      },
      complete: () => {
        console.log('Payroll processing completed');
      }
    });
  }

  getEmployeeName(code: string): string {
    const emp = this.employees.find(e => e.id === Number(code));
    return emp ? emp.fullName : code;
  }

  trackByEmployeeCode(index: number, item: PayrollProcessingModel): string {
    return item.employeeCode;
  }
  //reports
openPayrollReport(): void {
  this.payrollService.getPayrollReport().subscribe({
    next: (data: Blob) => {
      const fileURL = window.URL.createObjectURL(data);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Payroll.pdf'; // 👉 filename
      link.click();

      window.URL.revokeObjectURL(fileURL); // cleanup
    },
    error: (err) => {
      console.error('Error loading report:', err);
      alert('Failed to load payroll report');
    }
  });
}
//search


// ১. Search text hold korar jonno variable
searchText: string = ''; 

// ২. Filtered list return korar jonno logic
get filteredPayrollList() {
  // Jodi search box khali thake, puru list-tai dekhabe
  if (!this.searchText) {
    return this.payrollList;
  }

  const search = this.searchText.toLowerCase();

  return this.payrollList.filter(p => {
    const name = this.getEmployeeName(p.employeeCode).toLowerCase();
    const code = p.employeeCode.toString().toLowerCase();
    
    // Name ba Code - jekono ekta match korlei dekhabe
    return name.includes(search) || code.includes(search);
  });
}



}