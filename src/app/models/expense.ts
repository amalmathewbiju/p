export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  type: 'credit' | 'debit';
  date: Date;
  userId?: string;
}
