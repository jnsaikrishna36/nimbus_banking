"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { TopBar } from "@/components/TopBar";
import { AccountCard } from "@/components/AccountCard";
import { TransactionTable } from "@/components/TransactionTable";
import { useBank } from "@/components/AuthProvider";

function DashboardContent() {
  const { user, seedDemo } = useBank();
  if (!user) return null;

  const recent = [...user.transactions].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="container">
      <div className="section-head">
        <h2>Your accounts</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={seedDemo}>
            Add demo transactions
          </button>
          <Link href="/transfer" className="btn btn-primary">
            + New transfer
          </Link>
        </div>
      </div>
      <div className="grid grid-cards">
        {user.accounts.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Recent activity</h2>
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <TransactionTable
            transactions={recent}
            accounts={user.accounts}
            emptyMessage='No transactions yet — try "Add demo transactions" to see things in action.'
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <TopBar />
      <DashboardContent />
    </RequireAuth>
  );
}
