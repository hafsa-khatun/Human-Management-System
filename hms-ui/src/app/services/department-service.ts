import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DepartmentModel } from '../model/department-model';


@Injectable({ providedIn: 'root' })
export class DepartmentService {
   private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/departments';

  getAll() {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(map(res => res.map(d => DepartmentModel.fromApi(d))));
  }

  create(dep: DepartmentModel) {
    return this.http.post(this.baseUrl, dep.toApi());
  }

  update(id: number, dep: DepartmentModel) {
    return this.http.put(`${this.baseUrl}/${id}`, dep.toApi());
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}