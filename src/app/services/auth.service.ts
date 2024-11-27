import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { BehaviorSubject, catchError, delay, map, Observable, tap, throwError } from 'rxjs';


// export interface AuthResponse {
//   token: string;
//   user: User;
//   message: string;
// }


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:3000/users";

  // private jwtHelper = new JwtHelperService();
  // private tokenSubject = new BehaviorSubject<string | null>(null);

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  // token$ = this.tokenSubject.asObservable();
  
  constructor(private http: HttpClient) { 
    this.loadStoredAuth();
  }
  registerUser(userData: User) {
    const userWithExpenses = {
      ...userData,expenses: []
    }
    return this.http.post<User>(`${this.apiUrl}`, userWithExpenses).pipe(
      map((response) => {
        this.storeUser(response);
        return response;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Failed to register user'));
      })
      ,delay(2000));
  }

  login(credentials: {email:string,password:string}){
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}`).pipe(
      map( (users)=>{
        const user = users[0];
        if(user.email === credentials.email && user.password === credentials.password){
          this.storeUser(user);
          return user;
        }
        else{
          throw new Error('Invalid email or password');
        }
      }),
      catchError((error)=>{
        console.log('Login error: ',error);
        return throwError(()=>new Error('Login Failed'))
      })
    ,delay(1500))
  }

  logout(){
    return new Observable(observer => {
      setTimeout(() => {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        observer.next(true);
        observer.complete();
      }, 1000); 
    });
  }

  private storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredAuth(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  getCurrentUser(): User {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

}
