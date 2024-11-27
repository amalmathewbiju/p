import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../../models/expense';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Chart } from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddExpenseComponent } from '../add-expense/add-expense.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user';
import { LoadingService } from '../../services/loading.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  expenses: Expense[] = [];
  dataSource = new MatTableDataSource<Expense>();
  displayedColumns = ['date', 'category', 'description', 'amount', 'actions'];
  categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Others'];
  
  totalExpenses = 0;
  monthlyTotal = 0;
  dailyAverage = 0;
  categoryChart: any;
  monthlyChart: any;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadExpenseData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadExpenseData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.expenseService.getExpenses(currentUser.id).subscribe(expenses => {
        this.expenses = expenses;        
        this.dataSource.data = expenses;
        this.calculateStatistics();
        this.initializeCharts();
      });
    }
  }

  openAddExpenseDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseComponent, {
      width: '400px',
      data: { categories: this.categories }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.loadExpenseData(); // Simply reload the data
    });
  }
  

  deleteExpense(expenseId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      panelClass: 'matrix-dialog'
    });
    dialogRef.afterClosed().subscribe(res =>{
      if(res){
        this.loadingService.show();
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.id) {
          this.expenseService.deleteExpense(currentUser.id, expenseId).subscribe({
            next: ()=>{
              this.loadExpenseData();
              this.loadingService.hide();
            },
            error: ()=>{
              this.loadingService.hide();
            }
          });
        }
      }
    })

  }

  private calculateStatistics() {
    this.totalExpenses = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    
    this.monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    this.dailyAverage = this.monthlyTotal / daysInMonth;
  }

  private initializeCharts() {
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
    
    this.createCategoryChart();
    this.createMonthlyChart();
  }

  private createCategoryChart() {
    const categoryData = this.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: 'white', font:{ family: 'monospace',size:16},
          padding: 20 }
          }
        },
        elements: {
          arc: {
            borderWidth: 2,
            borderColor: '#000'
          }
        }
      }
    });
  }

  private createMonthlyChart() {
    const monthlyData = this.expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Monthly Expenses',
          data: Object.values(monthlyData),
          borderColor: '#36A2EB',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: 'white', font:{family: 'monospace', size:18} }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: 'white' ,font: { family: 'monospace'} },
            grid: { color: 'rgba(0, 255, 0, 0.1)' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(0, 255, 0, 0.1)' }
          }
        },
        elements: {
          line: {
            borderColor: '#00ff00',
            tension: 0.4,
            borderWidth: 2
          },
          point: {
            backgroundColor: '#00ff00',
            borderColor: '#000',
            borderWidth: 2,
            radius: 6,
            hoverRadius: 8
          }
        }
      }
    });
  }
}