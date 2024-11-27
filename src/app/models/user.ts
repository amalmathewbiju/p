import { Expense } from "./expense";

export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    expenses ?: Expense[];
  }
  