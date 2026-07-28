"use client";

import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopBar } from "@/components/TopBar";
import { useBank } from "@/components/AuthProvider";
import { TransactionTable } from "@/components/TransactionTable";

const CATEGORIES = [
  "Transfer",
  "Groceries",
  "Dining",
  "Bills",
  "Income",
  "Shopping",
  "Entertainment",
  "Other",
];

function HistoryContent() {
  const { user } = useBank();
  const [accountId, setAccountId] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!user) return [];
    const q = search.trim().toLowerCase();
    return [...user.transactions]
      .filter((t) => !accountId || t.accountId === accountId)
      .filter((t) => !category || t.category === category)
      .filter((t) => !q || (t.description || "").toLowerCase().includes(q))
      .sort((a, b) => b.date - a.date);
  }, [user, accountId, category, search]);

  if (!user) return null;

  return (
    <div className="container">
      <div className="section-head">
        <h2>Transaction history</h2>
        <div className="filters">
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">All accounts</option>
            {user.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <TransactionTable transactions={rows} accounts={user.accounts} emptyMessage="No matching transactions." />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <RequireAuth>
      <TopBar />
      <HistoryContent />
    </RequireAuth>
  );
}
