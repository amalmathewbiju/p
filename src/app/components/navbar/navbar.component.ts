import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  userName = '';

  constructor(
    private authService : AuthService,
    private router: Router,
    private loadingService: LoadingService
  ){}


  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser?.name || '';
  }

  logout() {
    this.loadingService.show();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      }
    });
  }
}
