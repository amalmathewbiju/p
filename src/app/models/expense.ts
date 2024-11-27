
export interface Expense {
    id?: number;
    userId: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type : 'credit' | 'debit',
  }