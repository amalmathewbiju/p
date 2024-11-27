import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  userName = '';

  constructor(
    private authService : AuthService,
    private router: Router
  ){}


  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser?.name || '';
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }

}
