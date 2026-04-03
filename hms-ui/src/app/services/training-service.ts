import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingModel } from '../model/training-moel';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private baseUrl = 'http://localhost:8080/api/trainings';

  constructor(private http: HttpClient) { }

// Training PDF download
downloadTrainingReport() {
  const url = 'http://localhost:8080/reports/training-report';
  return this.http.get(url, { responseType: 'blob' });
}


  createTraining(training: TrainingModel): Observable<TrainingModel> {
    return this.http.post<TrainingModel>(`${this.baseUrl}/create-training`, training);
  }

  getAllTrainings(): Observable<TrainingModel[]> {
    return this.http.get<TrainingModel[]>(`${this.baseUrl}`);
  }

  updateTraining(id: number, training: TrainingModel): Observable<TrainingModel> {
    return this.http.put<TrainingModel>(`${this.baseUrl}/${id}`, training);
  }

  deleteTraining(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${id}`,
      { responseType: 'text' }
    );
  }

}
