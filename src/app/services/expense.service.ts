import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = `${environment.apiUrl}/expenses`;  // Updated URL path

  constructor(private http: HttpClient) {}
  
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/me`);  // Get user-specific expenses
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  deleteExpense(expenseId: string): Observable<void> {  // Updated to string type for MongoDB ObjectId
    return this.http.delete<void>(`${this.apiUrl}/${expenseId}`);
  }


}
