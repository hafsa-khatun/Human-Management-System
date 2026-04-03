export interface DocumentModel {
  id?: number;
  fileName?: string;
  fileType?: string;
  documentType?: string;
  employeeId?: number; // ← Employee FK
}
