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

export interface PasswordReset {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

export interface UserRecord {
  name: string;
  username: string;
  passHash: string;
  accounts: Account[];
  transactions: Transaction[];
  /** Present only while a password reset is in flight. */
  reset?: PasswordReset;
}

export interface DB {
  users: Record<string, UserRecord>;
  session: string | null;
}
