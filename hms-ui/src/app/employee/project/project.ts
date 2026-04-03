import { Component, inject, OnInit, signal, computed } from '@angular/core';


import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Priority, ProjectModel, ProjectStatus } from '../../model/project-model';
import { ProjectService } from '../../services/project-service';

@Component({
  selector: 'app-project',
  imports: [FormsModule, CommonModule],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project implements OnInit{
 
  private service = inject(ProjectService);

  // All projects
  projects = signal<ProjectModel[]>([]);

  // New / edit project
  newProject = signal(new ProjectModel());

  // Enums for template
  ProjectStatus = ProjectStatus;
  Priority = Priority;
  statusList = Object.values(ProjectStatus);
  priorityList = Object.values(Priority);

  // Which status table to show
  showStatus = signal<ProjectStatus | null>(null);

  // Filtered lists
  pendingProjects = computed(() =>
    this.projects().filter(p => p.status === ProjectStatus.PENDING)
  );

  runningProjects = computed(() =>
    this.projects().filter(p => p.status === ProjectStatus.RUNNING)
  );

  completedProjects = computed(() =>
    this.projects().filter(p => p.status === ProjectStatus.COMPLETED)
  );

  ngOnInit(): void {
    this.loadProjects();
  }
// filtered projects based on button
filteredProjects = computed(() => {
  if (this.showStatus() === null) return this.projects(); // show all
  return this.projects().filter(p => p.status === this.showStatus());
});

  // Load from backend
  loadProjects() {
    this.service.getAll().subscribe(res => this.projects.set(res));
  }

  // Add new project
  addProject() {
    this.service.create(this.newProject()).subscribe(res => {
      this.projects.set([...this.projects(), res]);
      this.newProject.set(new ProjectModel());
      alert('Project added successfully');
    });
  }

  // Edit project
editProject(p: ProjectModel) {
  const copy = new ProjectModel();
  copy.projectId = p.projectId;
  copy.projectName = p.projectName;
  copy.projectCode = p.projectCode;
  copy.description = p.description;
  copy.startDate = p.startDate;
  copy.endDate = p.endDate;
  copy.budget = p.budget;
  copy.status = p.status;
  copy.clientName = p.clientName;
  copy.priority = p.priority;

  this.newProject.set(copy);
}


  // Update project
  updateProject() {
    const id = this.newProject().projectId;
    if (id === undefined) return; // TS safe check

    this.service.update(id, this.newProject()).subscribe(res => {
      const updatedList = this.projects().map(p =>
        p.projectId === res.projectId ? res : p
      );
      this.projects.set(updatedList);
      this.newProject.set(new ProjectModel());
      alert('Project updated successfully');
    });
  }

  // Delete project
  deleteProject(id?: number) {
    if (id === undefined) return; // TS safe
    this.service.delete(id).subscribe(() => {
      this.projects.set(this.projects().filter(p => p.projectId !== id));
      alert('Project deleted successfully');
    });
  }

  // Reset newProject form
  resetForm() {
    this.newProject.set(new ProjectModel());
  }
//reports
viewProjectReport(projectId: number) {
  this.service.getProjectReport(projectId)
    .subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    });
}



}