"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DB, Transaction, UserRecord } from "@/types";
import {
  accountById,
  authenticate,
  createUser,
  currentUser,
  loadDB,
  newId,
  requestPasswordReset,
  resetPassword,
  saveDB,
} from "@/lib/storage";
import { seedDemoTransactions } from "@/mocks/demoTransactions";

interface BankContextValue {
  ready: boolean;
  user: UserRecord | null;
  login: (username: string, password: string) => { error?: string };
  register: (name: string, username: string, password: string) => { error?: string };
  requestReset: (username: string) => { error?: string; code?: string };
  completeReset: (
    username: string,
    code: string,
    newPassword: string
  ) => { error?: string };
  logout: () => void;
  transfer: (
    fromId: string,
    toId: string,
    amount: number,
    description: string
  ) => { error?: string; info?: string };
  seedDemo: () => void;
}

const BankContext = createContext<BankContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>({ users: {}, session: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDb(loadDB());
    setReady(true);
  }, []);

  const persist = useCallback((next: DB) => {
    saveDB(next);
    setDb({ ...next, users: { ...next.users } });
  }, []);

  const login = useCallback(
    (username: string, password: string) => {
      const next = loadDB();
      const r = authenticate(next, username, password);
      if (r.error) return r;
      persist(next);
      return {};
    },
    [persist]
  );

  const register = useCallback(
    (name: string, username: string, password: string) => {
      const next = loadDB();
      const r = createUser(next, name, username, password);
      if (r.error) return r;
      persist(next);
      return {};
    },
    [persist]
  );

  const requestReset = useCallback(
    (username: string) => {
      const next = loadDB();
      const r = requestPasswordReset(next, username);
      if (r.error) return r;
      persist(next);
      return r;
    },
    [persist]
  );

  const completeReset = useCallback(
    (username: string, code: string, newPassword: string) => {
      const next = loadDB();
      const r = resetPassword(next, username, code, newPassword);
      // Persist either way: failed attempts increment the attempt counter.
      persist(next);
      return r;
    },
    [persist]
  );

  const logout = useCallback(() => {
    const next = loadDB();
    next.session = null;
    persist(next);
  }, [persist]);

  const transfer = useCallback(
    (fromId: string, toId: string, amount: number, description: string) => {
      const next = loadDB();
      const user = currentUser(next);
      if (!user) return { error: "Not signed in." };
      if (!fromId || !toId) return { error: "Pick both accounts." };
      if (fromId === toId) return { error: "Choose two different accounts." };
      if (!(amount > 0)) return { error: "Enter an amount greater than zero." };

      const from = accountById(user, fromId);
      const to = accountById(user, toId);
      if (!from || !to) return { error: "Account not found." };
      if (from.type !== "credit" && from.balance < amount) {
        return { error: `Insufficient funds in ${from.name}.` };
      }

      from.balance = +(from.balance - amount).toFixed(2);
      to.balance = +(to.balance + amount).toFixed(2);

      const now = Date.now();
      const desc = description.trim() || "Transfer";
      user.transactions.push(
        {
          id: newId(),
          date: now,
          accountId: from.id,
          amount: -amount,
          description: `To ${to.name}: ${desc}`,
          category: "Transfer",
        },
        {
          id: newId(),
          date: now,
          accountId: to.id,
          amount: amount,
          description: `From ${from.name}: ${desc}`,
          category: "Transfer",
        }
      );
      persist(next);
      return { info: `Transferred ${amount} from ${from.name} to ${to.name}.` };
    },
    [persist]
  );

  const seedDemo = useCallback(() => {
    const next = loadDB();
    const user = currentUser(next);
    if (!user) return;
    const txs: Transaction[] = seedDemoTransactions(user.accounts);
    user.transactions.push(...txs);
    persist(next);
  }, [persist]);

  const value = useMemo<BankContextValue>(
    () => ({
      ready,
      user: currentUser(db),
      login,
      register,
      requestReset,
      completeReset,
      logout,
      transfer,
      seedDemo,
    }),
    [ready, db, login, register, requestReset, completeReset, logout, transfer, seedDemo]
  );

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within AuthProvider");
  return ctx;
}
