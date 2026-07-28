import { Account, Transaction } from "@/types";
import { currency, iconFor } from "@/lib/format";

export function TransactionTable({
  transactions,
  accounts,
  emptyMessage,
}: {
  transactions: Transaction[];
  accounts: Account[];
  emptyMessage: string;
}) {
  if (!transactions.length) {
    return <div className="empty">{emptyMessage}</div>;
  }

  const findAccount = (id: string) => accounts.find((a) => a.id === id);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Account</th>
          <th>Category</th>
          <th style={{ textAlign: "right" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => {
          const acc = findAccount(t.accountId);
          const d = new Date(t.date);
          const isPos = t.amount >= 0;
          return (
            <tr key={t.id}>
              <td>
                {d.toLocaleDateString()}{" "}
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </td>
              <td>
                <span className="tx-icon">{iconFor(t.category)}</span>
                {t.description || "(no description)"}
              </td>
              <td>{acc ? acc.name : "—"}</td>
              <td>{t.category || "Other"}</td>
              <td style={{ textAlign: "right" }} className={isPos ? "amt-pos" : "amt-neg"}>
                {isPos ? "+" : "-"}
                {currency.format(Math.abs(t.amount))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
