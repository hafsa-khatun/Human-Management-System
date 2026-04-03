export interface LeaveRequestModel {
  id?: number;
  employeeCode: string;
  employeeName: string;
  leaveType: string;
  startDate:string;
  endDate: string; // yyyy-mm-dd
  reason: string;
  leaveProposal: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
