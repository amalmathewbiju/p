import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  currentUserId: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<AddExpenseComponent>,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private loadingService: LoadingService,
    private expenseService: ExpenseService,
    @Inject(MAT_DIALOG_DATA) public data: { categories: string[] }
  ) {
    const currentUser = this.authService.currentUser;
    this.currentUserId = currentUser?.id || '';

    this.expenseForm = fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      type: ['debit', Validators.required],
      useCurrentDate: [true],
      date: [new Date()],
      userId: [this.currentUserId]
    });
  }

  ngOnInit(): void {
    this.expenseForm.get('useCurrentDate')?.valueChanges.subscribe(useCurrentDate => {
      if (useCurrentDate) {
        this.expenseForm.patchValue({ date: new Date() });
      }
    });
  }

onSubmit(): void {
  if (this.expenseForm.valid) {
    this.loadingService.show();
    
    const expenseData = {
      description: this.expenseForm.value.description,
      amount: Number(this.expenseForm.value.amount),
      category: this.expenseForm.value.category,
      type: this.expenseForm.value.type,
      date: this.expenseForm.value.useCurrentDate 
        ? new Date() 
        : this.expenseForm.value.date
    };

    this.expenseService.addExpense(expenseData).subscribe({
      next: (response) => {
        this.dialogRef.close(response);  // Pass the new expense back
        this.loadingService.hide();
        this.snackbar.open('Expense added successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Expense addition error:', error);
        this.loadingService.hide();
        this.snackbar.open('Failed to add expense', 'Close', { 
          duration: 3000 
        });
      }
    });
  }
}

  
}
