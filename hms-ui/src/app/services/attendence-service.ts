import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AttendanceReportModel } from '../model/attendence-model';


@Injectable({ providedIn: 'root' })
export class AttendanceService {

  private api = 'http://localhost:8080/attendance';

  attendanceList = signal<AttendanceReportModel[]>([]);

  constructor(private http: HttpClient) {}

  // Load all attendance reports
  loadAll() {
    this.http.get<AttendanceReportModel[]>(this.api)
      .pipe(tap(list => this.attendanceList.set(list)))
      .subscribe();
  }

  // CREATE
  create(report: AttendanceReportModel) {
    return this.http.post<AttendanceReportModel>(this.api, report)
      .pipe(
        tap(r => this.attendanceList.set([...this.attendanceList(), r]))
      );
  }

  // UPDATE
  update(id: number, report: AttendanceReportModel) {
    return this.http.put<AttendanceReportModel>(`${this.api}/${id}`, report)
      .pipe(
        tap(r => {
          const updated = this.attendanceList().map(a => a.id === id ? r : a);
          this.attendanceList.set(updated);
        })
      );
  }

  // DELETE
  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`)
      .pipe(
        tap(() => {
          const filtered = this.attendanceList().filter(a => a.id !== id);
          this.attendanceList.set(filtered);
        })
      );
  }
}
