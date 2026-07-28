import { Account, DB, UserRecord } from "@/types";

const STORAGE_KEY = "nimbus_bank_v1";

export function loadDB(): DB {
  if (typeof window === "undefined") return { users: {}, session: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DB) : { users: {}, session: null };
  } catch {
    return { users: {}, session: null };
  }
}

export function saveDB(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function toyHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i);
  return "" + (h >>> 0);
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function defaultAccounts(): Account[] {
  return [
    { id: newId(), type: "checking", name: "Everyday Checking", balance: 2500.0 },
    { id: newId(), type: "savings", name: "High-Yield Savings", balance: 8200.5 },
    { id: newId(), type: "credit", name: "Nimbus Rewards Card", balance: -345.2 },
  ];
}

export function createUser(
  db: DB,
  name: string,
  username: string,
  password: string
): { error?: string } {
  if (!username || !password) return { error: "Username and password required." };
  if (password.length < 4) return { error: "Password must be at least 4 characters." };
  if (db.users[username]) return { error: "That username is already taken." };
  const user: UserRecord = {
    name: name || username,
    username,
    passHash: toyHash(password),
    accounts: defaultAccounts(),
    transactions: [],
  };
  db.users[username] = user;
  return {};
}

export function authenticate(db: DB, username: string, password: string): { error?: string } {
  const u = db.users[username];
  if (!u || u.passHash !== toyHash(password)) return { error: "Invalid username or password." };
  db.session = username;
  return {};
}

export function currentUser(db: DB): UserRecord | null {
  return db.session ? db.users[db.session] ?? null : null;
}

export function accountById(user: UserRecord, id: string): Account | undefined {
  return user.accounts.find((a) => a.id === id);
}
