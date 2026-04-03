import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SalaryModel } from '../model/salary-model';


@Injectable({ providedIn: 'root' })
export class SalaryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/salary';

  // Get all salaries
  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}/all`)
      .pipe(map(res => res.map(s => SalaryModel.fromApi(s))));
  }

  // Get by id
  getById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(map(s => SalaryModel.fromApi(s)));
  }

  // Create new salary
  create(salary: SalaryModel) {
    return this.http.post(`${this.baseUrl}/save`, salary.toApi());
  }

  // Update existing salary
  update(id: number, salary: SalaryModel) {
    return this.http.put(`${this.baseUrl}/update/${id}`, salary.toApi());
  }

  // Delete salary
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}