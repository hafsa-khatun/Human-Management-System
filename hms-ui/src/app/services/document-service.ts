import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentModel } from '../model/document-model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private baseUrl = 'http://localhost:8080/documents';

  constructor(private http: HttpClient) {}

  upload(empId: number, file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return this.http.post(
      `${this.baseUrl}/upload/${empId}`,
      formData
    );
  }

  getByEmployee(employeeId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/employee/${employeeId}`);
  }

  download(documentId: number) {
    return this.http.get(
      `${this.baseUrl}/download/${documentId}`,
      { responseType: 'blob' }
    );
  }

  delete(documentId: number) {
    return this.http.delete(`${this.baseUrl}/${documentId}`);
  }
}
