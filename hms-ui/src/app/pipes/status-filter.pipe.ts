import { Pipe, PipeTransform } from '@angular/core';
import { AttendanceReportModel } from '../model/attendence-model';


@Pipe({
  name: 'statusFilter',
  standalone: true, // standalone pipe
  pure: false       // signal auto update 
})
export class StatusFilterPipe implements PipeTransform {
  transform(list: AttendanceReportModel[], status: string): AttendanceReportModel[] {
    if (!list || !status) return [];
    return list.filter(a => a.status === status);
  }
}
