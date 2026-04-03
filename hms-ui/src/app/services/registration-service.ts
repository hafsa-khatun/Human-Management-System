import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationModel } from '../model/registration-model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private baseUrl = 'http://localhost:8080/api/registrations';

  registrations = signal<RegistrationModel[]>([]);

  constructor(private http: HttpClient) {}

  loadRegistrations(): void {
    this.http.get<RegistrationModel[]>(this.baseUrl)
      .pipe(tap(data => this.registrations.set(data)))
      .subscribe();
  }

  createRegistration(reg: RegistrationModel) {
    return this.http.post<RegistrationModel>(this.baseUrl, reg);
  }

  updateRegistration(id: number, reg: RegistrationModel) {
    return this.http.put<RegistrationModel>(`${this.baseUrl}/${id}`, reg);
  }

  deleteRegistration(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
