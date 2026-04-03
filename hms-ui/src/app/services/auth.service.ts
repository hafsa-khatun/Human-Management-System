import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, AuthUser } from '../model/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api/auth';
  private authUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public authUser$ = this.authUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authUser', JSON.stringify({
            id: response.id,
            username: response.username,
            role: response.role,
            token: response.token,
            fullName: response.fullName,
            employeeId: response.employeeId
          }));
          this.authUserSubject.next({
            id: response.id,
            username: response.username,
            role: response.role,
            token: response.token,
            fullName: response.fullName,
            employeeId: response.employeeId
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.authUserSubject.next(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.authUserSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'USER';
  }

  private loadFromLocalStorage(): void {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authUserSubject.next(user);
      } catch (e) {
        console.error('Error parsing auth user:', e);
      }
    }
  }
}