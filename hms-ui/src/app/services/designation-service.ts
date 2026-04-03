import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DesignationModel } from '../model/designation-model';

@Injectable({ providedIn: 'root' })
export class DesignationService {
   private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/designations';

  getAll() {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(map(res => res.map(d => DesignationModel.fromApi(d))));
  }

  create(desg: DesignationModel) {
    return this.http.post(this.baseUrl, desg.toApi());
  }

  update(id: number, desg: DesignationModel) {
    return this.http.put(`${this.baseUrl}/${id}`, desg.toApi());
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getByDepartment(deptId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/by-department/${deptId}`)
      .pipe(map(res => res.map(d => DesignationModel.fromApi(d))));
  }
}