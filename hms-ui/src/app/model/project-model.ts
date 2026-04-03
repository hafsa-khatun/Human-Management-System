export enum ProjectStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED'
}

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export class ProjectModel {
  projectId?: number;
  projectName = '';
  projectCode = '';
  description = '';
  startDate?: string; // ISO string "2026-02-27"
  endDate?: string;
  budget?: number;
  status: ProjectStatus = ProjectStatus.PENDING;
  clientName = '';
  priority: Priority = Priority.MEDIUM;

  constructor(data?: Partial<ProjectModel>) {
    if (data) Object.assign(this, data);
  }
}
