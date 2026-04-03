import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeModel } from '../model/employee-model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';
//reports
  getEmployeeReport() {
    return this.http.get('http://localhost:8080/reports/employee-report', { responseType: 'blob' });
  }

//sashboard
private employeesSubject = new BehaviorSubject<EmployeeModel[]>([]);
employees$ = this.employeesSubject.asObservable();
//end

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(this.apiUrl);
  }

  getByStatus(status: string): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(`${this.apiUrl}/status/${status}`);
  }

  create(employee: EmployeeModel): Observable<EmployeeModel> {
    return this.http.post<EmployeeModel>(this.apiUrl, employee);
  }

  update(id: number, employee: EmployeeModel): Observable<EmployeeModel> {
    return this.http.put<EmployeeModel>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}