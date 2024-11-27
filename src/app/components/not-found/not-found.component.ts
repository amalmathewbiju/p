import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
  <app-matrix-rain/>

  <div class="not-found-container">
  <mat-icon class="error-icon">error_outline</mat-icon>
  <h1>404</h1>
  <h2>Page Not Found</h2>
  <p>The page you're looking for doesn't exist or has been moved.</p>
  <button mat-raised-button color="primary" (click)="goHome()">
    <mat-icon>home</mat-icon>
    Return to Home
  </button>
</div>
`,
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
