import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layouts',
  standalone: true, // Jodi standalone hoy
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
})
export class Layouts {
  // Prtekta section-er jonno alada state
  isEmployeeCollapsed: boolean = false; // Default-e khola thakbe
  isHRCollapsed: boolean = true;
  isTrainingCollapsed: boolean = true;

  // Purono variable gulo jodi proyojon hoy
  isCollapsed: boolean = true;
  isInventoryCollapsed: boolean = true;
}