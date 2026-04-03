import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveModel } from '../model/leave-model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  private baseUrl = 'http://localhost:8080/api/leaves';

  leaves = signal<LeaveModel[]>([]);

  constructor(private http: HttpClient) {}

  loadLeaves(): void {
    this.http.get<LeaveModel[]>(this.baseUrl).subscribe(data => this.leaves.set(data));
  }

  getLeavesByRegistrationId(regId: number): void {
    this.http.get<LeaveModel[]>(`${this.baseUrl}/registration/${regId}`).subscribe(data => this.leaves.set(data));
  }

  createLeave(leave: LeaveModel): Observable<LeaveModel> {
    return this.http.post<LeaveModel>(this.baseUrl, leave);
  }

  updateLeave(id: number, leave: LeaveModel): Observable<LeaveModel> {
    return this.http.put<LeaveModel>(`${this.baseUrl}/${id}`, leave);
  }

 deleteLeave(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
