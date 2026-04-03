export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
  token: string;
  fullName: string;
  employeeId?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
  token: string;
  fullName: string;
  employeeId?: number;
}