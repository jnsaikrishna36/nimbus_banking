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

export type MarketingChannel = "email" | "sms" | "push" | "post";
export type MarketingTopic = "productNews" | "offers" | "rewards" | "research";
export type MarketingFrequency = "realtime" | "weekly" | "monthly";

export interface MarketingPreferences {
  /** Where we're allowed to reach the customer. */
  channels: Record<MarketingChannel, boolean>;
  /** What we're allowed to talk about. */
  topics: Record<MarketingTopic, boolean>;
  frequency: MarketingFrequency;
  /** Use this customer's own activity to tailor what they're shown. */
  personalization: boolean;
  /** Share with partner brands for their own marketing. */
  thirdParty: boolean;
  updatedAt: number;
}

export interface UserRecord {
  name: string;
  username: string;
  passHash: string;
  accounts: Account[];
  transactions: Transaction[];
  /** Present only while a password reset is in flight. */
  reset?: PasswordReset;
  /** Absent on accounts created before marketing preferences shipped. */
  marketing?: MarketingPreferences;
}

export interface DB {
  users: Record<string, UserRecord>;
  session: string | null;
}
