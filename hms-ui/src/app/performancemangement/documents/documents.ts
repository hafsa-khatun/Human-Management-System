import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-service';
import { DocumentService } from '../../services/document-service';
import { EmployeeModel } from '../../model/employee-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentModel } from '../../model/document-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-documents',
  standalone: true, 
  imports: [FormsModule,CommonModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit{
 safePreviewUrl: SafeResourceUrl | null = null;
  employees: EmployeeModel[] = [];
  selectedEmployeeId?: number;
  documents: DocumentModel[] = [];
  selectedFile?: File;
  documentType = '';
  filePreview: string | ArrayBuffer | null = null;
  fileType: string | null = null;

  constructor(
    private empService: EmployeeService,
    private docService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.empService.getAll().subscribe(res => this.employees = res);
  }

  loadDocuments() {
    if (!this.selectedEmployeeId) return;
    this.docService.getByEmployee(Number(this.selectedEmployeeId)).subscribe({
      next: res => this.documents = res,
      error: () => this.documents = []
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.filePreview = null;
      this.safePreviewUrl = null;
      return;
    }
    this.selectedFile = input.files[0];
    this.fileType = this.selectedFile.type;

    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview = reader.result;
      if (reader.result && typeof reader.result === 'string') {
        this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result);
      }
    };
    reader.readAsDataURL(this.selectedFile);
  }

  isImage(): boolean {
    return this.fileType?.startsWith('image/') ?? false;
  }

  isPdf(): boolean {
    return this.fileType?.startsWith('application/pdf') ?? false;
  }

upload() {
  if (!this.selectedEmployeeId || !this.selectedFile || !this.documentType) {
    alert('Employee, file, and type select koro!');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('documentType', this.documentType); 

  this.docService.upload(Number(this.selectedEmployeeId), this.selectedFile, this.documentType)
    .subscribe({
      next: res => {
        alert('File uploaded!');
        this.selectedFile = undefined;
        this.documentType = '';
        this.filePreview = null;
        this.fileType = null;
        this.loadDocuments();
      },
      error: err => {
        console.error('Upload error', err);
        alert('Upload failed');
      }
    });
}


  download(doc: DocumentModel) {
    if (!doc.id) return;
    this.docService.download(doc.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName!;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  delete(doc: DocumentModel) {
    if (!doc.id) return;
    this.docService.delete(doc.id).subscribe(() => {
      alert('Document deleted');
      this.loadDocuments();
    });
  }
}
