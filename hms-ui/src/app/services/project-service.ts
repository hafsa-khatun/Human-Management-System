import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel } from '../model/project-model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/projects';

//reports
getProjectReport(pId: number) {
  return this.http.get(`http://localhost:8080/reports/project-report`, {
    params: { pId: pId },
    responseType: 'blob'
  });
}


  getAll(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(this.api);
  }

  create(project: ProjectModel): Observable<ProjectModel> {
    return this.http.post<ProjectModel>(this.api, project);
  }

  update(id: number, project: ProjectModel): Observable<ProjectModel> {
    return this.http.put<ProjectModel>(`${this.api}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
