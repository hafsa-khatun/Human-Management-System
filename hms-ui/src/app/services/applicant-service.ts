import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicantModel } from '../model/applicant-model';


@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  private baseUrl = 'http://localhost:8080/api/applicants';

  constructor(private http: HttpClient) { }

  // ➜ Create Applicant
  createApplicant(applicant: ApplicantModel): Observable<ApplicantModel> {
    return this.http.post<ApplicantModel>(
      `${this.baseUrl}/create-applicant`,
      applicant
    );
  }

  // ➜ Get All Applicants
  getAllApplicants(): Observable<ApplicantModel[]> {
    return this.http.get<ApplicantModel[]>(this.baseUrl);
  }

  // ➜ Update Status
  updateStatus(id: number, status: string): Observable<ApplicantModel> {
    return this.http.put<ApplicantModel>(
      `${this.baseUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  // ➜ Delete Applicant
  deleteApplicant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

// Applicant PDF download
downloadApplicantReport() {
  const url = 'http://localhost:8080/reports/applicant-report';
  return this.http.get(url, { responseType: 'blob' });
}


}
