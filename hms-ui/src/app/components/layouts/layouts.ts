import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layouts',
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './layouts.html',
  styleUrl: './layouts.scss',
})
export class Layouts {
isCollapsed: boolean = true;
isInventoryCollapsed: boolean = true;

toggleQC() {
  this.isCollapsed = !this.isCollapsed;
  console.log('Quality Control status:', this.isCollapsed);
}

}
