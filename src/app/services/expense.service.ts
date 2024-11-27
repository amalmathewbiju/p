import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense';
import { BehaviorSubject, delay, map, switchMap } from 'rxjs';
import { User } from '../models/user';



@Injectable({
  providedIn: 'root'
})


export class ExpenseService {

  private apiUrl = 'http://localhost:3000/users';


  constructor(private http: HttpClient) { }

  getExpenses(userId: string | undefined){
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map(user => user.expenses || [])
    );  }

  addExpense(userId: string, expense: Expense) {
      return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
        switchMap(user => {
          const currentExpenses = user.expenses || [];

          const updatedExpenses = [...currentExpenses, {
            id: expense.id,
            userId: expense.userId,
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            type: expense.type,
            date: expense.date    
          }]

          return this.http.patch(`${this.apiUrl}/${userId}`, {
            expenses: updatedExpenses
          });
        })
      ,delay(1500));
    }

  updateExpense(expense: Expense){
    return this.http.put<Expense>(`${this.apiUrl}/${expense.id}`,expense)
  }

  deleteExpense(userId: string, expenseId: number) {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      switchMap(user => {
        const currentExpenses = user.expenses || [];
        const updatedExpenses = currentExpenses.filter(exp => exp.id !== expenseId);
        return this.http.patch<User>(`${this.apiUrl}/${userId}`, {
          expenses: updatedExpenses
        });
      })
      ,delay(1500));
  }

  getExpenseByCategory(userId: string) {
    return this.getExpenses(userId).pipe(
      map((expenses : Expense[]) => 
        expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>)
      )
    );
  }

  getMonthlyExpenses(userId: string) {
    return this.getExpenses(userId).pipe(
      map((expenses : Expense[]) => 
        expenses.reduce((acc, expense) => {
          const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>)
      )
    );
  }

  getTotalExpenses(userId: string) {
    return this.getExpenses(userId).pipe(
      map((expenses:Expense[]) => 
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

}
