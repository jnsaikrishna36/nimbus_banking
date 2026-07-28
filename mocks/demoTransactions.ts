import { Account, AccountType, Transaction } from "@/types";
import { newId } from "@/lib/storage";

interface SeedSpec {
  offsetDays: number;
  account: AccountType;
  amount: number;
  description: string;
  category: string;
}

const SEED: SeedSpec[] = [
  { offsetDays: 22, account: "checking", amount: 3200, description: "Payroll deposit", category: "Income" },
  { offsetDays: 20, account: "checking", amount: -1450, description: "Rent — June", category: "Bills" },
  { offsetDays: 18, account: "credit", amount: -84.2, description: "Whole Foods", category: "Groceries" },
  { offsetDays: 16, account: "credit", amount: -34.1, description: "Lyft", category: "Other" },
  { offsetDays: 14, account: "checking", amount: -60.0, description: "Electric bill", category: "Bills" },
  { offsetDays: 12, account: "credit", amount: -52.75, description: "Sushi w/ friends", category: "Dining" },
  { offsetDays: 11, account: "credit", amount: -119.99, description: "Sneakers", category: "Shopping" },
  { offsetDays: 9, account: "checking", amount: -15.99, description: "Streaming subscription", category: "Entertainment" },
  { offsetDays: 8, account: "credit", amount: -42.3, description: "Trader Joe's", category: "Groceries" },
  { offsetDays: 6, account: "savings", amount: 500.0, description: "Auto-save sweep", category: "Income" },
  { offsetDays: 4, account: "credit", amount: -28.4, description: "Movie tickets", category: "Entertainment" },
  { offsetDays: 2, account: "checking", amount: -120.0, description: "Gas + groceries", category: "Groceries" },
];

const DAY_MS = 86400000;

export function seedDemoTransactions(accounts: Account[]): Transaction[] {
  const byType: Partial<Record<AccountType, Account>> = Object.fromEntries(
    accounts.map((a) => [a.type, a])
  );
  const now = Date.now();

  return SEED.map((s) => {
    const acc = byType[s.account];
    if (!acc) throw new Error(`No account of type "${s.account}" to seed against`);
    acc.balance = +(acc.balance + s.amount).toFixed(2);
    return {
      id: newId(),
      date: now - s.offsetDays * DAY_MS,
      accountId: acc.id,
      amount: s.amount,
      description: s.description,
      category: s.category,
    };
  });
}
