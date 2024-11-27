import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';


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

  // registerUser(userData: User){
  //   return this.http.post<AuthResponse>(`${this.apiUrl}`,userData).pipe(
  //     map(response=> {
  //       if(response){
  //         this.handleAuthentication(response)
  //       }
  //         return response;
  //     }
  //     )
      
  //   )
  // }

  // login(credentials: { email: string; password: string }){
  //   return this.http.post<AuthResponse>(`${this.apiUrl}`, credentials).pipe(
  //     map(response => {
  //       if(response){
  //         this.handleAuthentication(response)
  //       }
  //       return response
  //     }
  //   )
  // )
  // }

  // logout(): void {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   this.currentUserSubject.next(null);
  //   this.tokenSubject.next(null);
  // }

  // private handleAuthentication(response: any): void {
  //   if (response.token) {
  //     localStorage.setItem('token', response.token);
  //   }
  //   if (response.user) {
  //     localStorage.setItem('user', JSON.stringify(response.user));
  //     this.currentUserSubject.next(response.user);
  //     this.tokenSubject.next(response.token);
  //   }
  // }
  
  // private loadStoredAuth(): void {
  //   const token = localStorage.getItem('token');
  //   const userStr = localStorage.getItem('user');

  //   if (token && userStr) {
  //     try {
  //       const user = JSON.parse(userStr);
  //       this.currentUserSubject.next(user);
  //       this.tokenSubject.next(token);
  //     } catch (error) {
  //       this.logout();
  //     }
  //   }
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // isLoggedIn(): boolean {
  //   return !!this.getToken();
  // }

  // getCurrentUser(): User | null {
  //   return this.currentUserSubject.value;
  // }



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
    );
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
    )
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
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
