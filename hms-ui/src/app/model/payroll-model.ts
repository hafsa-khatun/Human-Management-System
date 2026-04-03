export interface PayrollProcessingModel {
  id?: number;
  employeeCode: string;
  basicSalary: number;
  grossSalary?: number;
  deduction?: number;
  netSalary?: number;
  absentDays?: number;
  approvedLeaveDays?: number;
  month?: string; // "2026-02"
}
