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

const RESET_CODE_TTL_MS = 15 * 60 * 1000;
const RESET_MAX_ATTEMPTS = 5;

/**
 * Issues a one-time reset code for `username`.
 *
 * This demo has no email delivery, so the code is handed back to the caller and
 * shown on screen — which also means it confirms whether a username exists. A real
 * backend would mail the code and always report success, to avoid leaking that.
 */
export function requestPasswordReset(
  db: DB,
  username: string
): { error?: string; code?: string } {
  if (!username) return { error: "Enter your username." };
  const u = db.users[username];
  if (!u) return { error: "No account found with that username." };

  const code = String(Math.floor(100000 + Math.random() * 900000));
  u.reset = {
    codeHash: toyHash(code),
    expiresAt: Date.now() + RESET_CODE_TTL_MS,
    attempts: 0,
  };
  return { code };
}

export function resetPassword(
  db: DB,
  username: string,
  code: string,
  newPassword: string
): { error?: string } {
  const u = db.users[username];
  if (!u || !u.reset) return { error: "Request a reset code first." };

  if (Date.now() > u.reset.expiresAt) {
    delete u.reset;
    return { error: "That code has expired. Request a new one." };
  }

  if (u.reset.codeHash !== toyHash(code.trim())) {
    u.reset.attempts += 1;
    if (u.reset.attempts >= RESET_MAX_ATTEMPTS) {
      delete u.reset;
      return { error: "Too many incorrect attempts. Request a new code." };
    }
    const left = RESET_MAX_ATTEMPTS - u.reset.attempts;
    return { error: `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` };
  }

  // Code was correct — a weak new password is rejected without burning the code.
  if (newPassword.length < 4) return { error: "Password must be at least 4 characters." };

  u.passHash = toyHash(newPassword);
  delete u.reset;
  // Force a fresh sign-in if this account happened to be the active session.
  if (db.session === username) db.session = null;
  return {};
}

export function currentUser(db: DB): UserRecord | null {
  return db.session ? db.users[db.session] ?? null : null;
}

export function accountById(user: UserRecord, id: string): Account | undefined {
  return user.accounts.find((a) => a.id === id);
}
