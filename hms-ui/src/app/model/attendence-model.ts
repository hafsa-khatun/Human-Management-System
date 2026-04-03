export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE'
}


export interface AttendanceReportModel {
  id?: number;                // optional for new records
  employeeCode: string;
  employeeName: string;
  date: string;               // ISO string: "2026-02-21"
  inTime: string;             // "09:00"
  outTime: string;            // "17:00"
  status: AttendanceStatus;
}
