export type AccountType = "checking" | "savings" | "credit";

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: number;
  accountId: string;
  amount: number;
  description: string;
  category: string;
}

export interface UserRecord {
  name: string;
  username: string;
  passHash: string;
  accounts: Account[];
  transactions: Transaction[];
}

export interface DB {
  users: Record<string, UserRecord>;
  session: string | null;
}
