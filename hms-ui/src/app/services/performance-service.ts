import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerformanceModel } from '../model/performance-model';


@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private baseUrl = 'http://localhost:8080/performances';

  constructor(private http: HttpClient) { }

  getAllPerformances(): Observable<PerformanceModel[]> {
    return this.http.get<PerformanceModel[]>(this.baseUrl);
  }

  getPerformanceByEmployee(employeeId: number): Observable<PerformanceModel[]> {
    return this.http.get<PerformanceModel[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  addPerformance(performance: PerformanceModel): Observable<PerformanceModel> {
    return this.http.post<PerformanceModel>(this.baseUrl, performance);
  }

  updatePerformance(id: number, performance: PerformanceModel): Observable<PerformanceModel> {
    return this.http.put<PerformanceModel>(`${this.baseUrl}/${id}`, performance);
  }

  deletePerformance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  //reports
  getPerformanceReport() {
  return this.http.get('http://localhost:8080/reports/performance-report', { 
    responseType: 'blob'  
  });
}

}
