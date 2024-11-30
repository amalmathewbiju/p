import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  // Skip token for auth endpoints
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // Add token to other requests
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return next(clonedRequest).pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.clear();
          router.navigate(['/login']);
        }
        throw error;
      })
    );
  }

  return next(req);
};
