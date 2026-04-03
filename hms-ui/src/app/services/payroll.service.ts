import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayrollProcessingModel } from '../model/payroll-model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private baseUrl = 'http://localhost:8080/api/payroll';

  constructor(private http: HttpClient) {}

  // ✅ এই method টা ব্যবহার করুন - ঠিক fix করা
  processPayroll(month: string): Observable<PayrollProcessingModel[]> {
    return this.http.post<PayrollProcessingModel[]>(
      `${this.baseUrl}/process-payroll?month=${month}`,
      {} // Empty body পাঠান
    );
  }

  getAll(): Observable<PayrollProcessingModel[]> {
    return this.http.get<PayrollProcessingModel[]>(this.baseUrl);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}