import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  private tokenKey = 'token';

  constructor(private http: HttpClient,
    private router: Router
  ) { this.validateStoredToken(); }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return payload.exp * 1000 < Date.now(); // Check expiration
    } catch (e) {
      return true; // Treat invalid tokens as expired
    }
  }
  
  private validateStoredToken() {
    const token = this.authToken;
    if (token && this.isTokenExpired(token)) {
      console.warn('Token has expired');
      this.logout();
    }
  }
  
  

  private setAuthData(response: AuthResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }


  isAuthenticated(): boolean {
    return !!(this.authToken && this.currentUser);
  }



  get authToken(): string {
    const token = localStorage.getItem(this.tokenKey);
    return token || '';
  }

  checkAuthStatus(): boolean {
    const token = this.authToken;
    const user = this.currentUser;
    return !!(token && user && !this.isTokenExpired(token));
  }
  



  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        this.setAuthData(response);
      })
    );
  }
  



registerUser(user: User): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
    tap((response: AuthResponse) => {
      this.setAuthData(response);
    })
  );
}



logout(): void {
  localStorage.clear();
  this.currentUserSubject.next(null);
  this.router.navigate(['/login']);
}


}
