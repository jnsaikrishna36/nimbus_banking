import { Account } from "@/types";
import { currency } from "@/lib/format";

const PILL_CLASS: Record<Account["type"], string> = {
  checking: "pill-checking",
  savings: "pill-savings",
  credit: "pill-credit",
};

export function AccountCard({ account }: { account: Account }) {
  return (
    <div className="card">
      <h3>{account.name}</h3>
      <div className="balance">{currency.format(account.balance)}</div>
      <div className="acc-meta">
        <span className={`acc-type-pill ${PILL_CLASS[account.type]}`}>{account.type}</span>
        <span>•••• {account.id.slice(-4).toUpperCase()}</span>
      </div>
    </div>
  );
}
