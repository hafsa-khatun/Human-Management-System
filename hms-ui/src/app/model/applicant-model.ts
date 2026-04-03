export interface ApplicantModel {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  status?: string;  // APPLIED / SELECTED / REJECTED
}
