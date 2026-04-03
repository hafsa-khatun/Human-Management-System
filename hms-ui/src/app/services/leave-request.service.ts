import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaveRequestModel } from '../model/leave-request-model';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {

  private api = 'http://localhost:8080/leave';
  private _leaveList = new BehaviorSubject<LeaveRequestModel[]>([]);
  leaveList$ = this._leaveList.asObservable();

  constructor(private http: HttpClient) {}

  loadAll() {
    this.http.get<LeaveRequestModel[]>(this.api)
      .pipe(tap(list => this._leaveList.next(list)))
      .subscribe();
  }

  applyLeave(leave: LeaveRequestModel) {
    return this.http.post<LeaveRequestModel>(this.api, leave)
      .pipe(tap(l => {
        const current = this._leaveList.getValue();
        this._leaveList.next([...current, l]); // new array for change detection
      }));
  }

  approveLeave(id: number) {
    return this.http.put<LeaveRequestModel>(`${this.api}/approve/${id}`, {})
      .pipe(tap(updated => {
        const current = this._leaveList.getValue();
        const idx = current.findIndex(x => x.id === id);
        if (idx > -1) current[idx] = updated;
        this._leaveList.next([...current]); // 🔹 important for UI update
      }));
  }

  rejectLeave(id: number) {
    return this.http.put<LeaveRequestModel>(`${this.api}/reject/${id}`, {})
      .pipe(tap(updated => {
        const current = this._leaveList.getValue();
        const idx = current.findIndex(x => x.id === id);
        if (idx > -1) current[idx] = updated;
        this._leaveList.next([...current]); // 🔹 important
      }));
  }

  deleteLeave(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
