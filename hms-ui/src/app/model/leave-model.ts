export interface LeaveModel {
  id?: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  registration: {
    id: number;       // backend expects only id
    name?: string;
    phone?: string;
    reason?: string;
  };
}
