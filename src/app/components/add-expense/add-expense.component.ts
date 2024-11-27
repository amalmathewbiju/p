import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { User } from '../../models/user';
import { Expense } from '../../models/expense';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent implements OnInit{

  expenseForm: FormGroup;
  currentUserId: string;

  constructor(fb: FormBuilder,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private snackbar: MatSnackBar,
    private authService : AuthService,
    private expenseService : ExpenseService,
    @Inject(MAT_DIALOG_DATA) public data: {categories: string[]}){

      const currentUser = this.authService.getCurrentUser();
      this.currentUserId = currentUser?.id || '';

      this.expenseForm = fb.group({
        category: ['', Validators.required],
        amount: ['', [Validators.required, Validators.min(0)]],
        description: ['', Validators.required],
        type: ['debit', Validators.required],
        useCurrentDate: [true], 
        date: [new Date().toISOString()],
        userId: [this.currentUserId]
    });
  }

  ngOnInit(): void {
    this.expenseForm.get('useCurrentDate')?.valueChanges.subscribe(useCurrentDate=>{
      if(useCurrentDate){
        this.expenseForm.patchValue({date: new Date()});
      }
    })
  }
  
  onSubmit(): void {
    if (this.expenseForm.valid) {
      const currentUser = this.authService.getCurrentUser() as User;
      const selectedDate = this.expenseForm.get('useCurrentDate')?.value? (new Date().toISOString()) : (new Date(this.expenseForm.get('date')?.value).toISOString()) 
      const expenseData: Expense = {
        id: Date.now(),
        userId: currentUser.id!,
        category: this.expenseForm.value.category,
        amount: this.expenseForm.value.amount,
        description: this.expenseForm.value.description,
        type: this.expenseForm.value.type,
        date: selectedDate
      };
  
      this.expenseService.addExpense(currentUser.id!, expenseData).subscribe(() => {
        this.dialogRef.close(); 
        this.snackbar.open('Expense added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      });
    }
  }
  
  
}
