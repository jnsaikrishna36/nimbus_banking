"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { TopBar } from "@/components/TopBar";
import { useBank } from "@/components/AuthProvider";
import { CategoryChart } from "@/components/CategoryChart";
import { BalanceChart } from "@/components/BalanceChart";

function InsightsContent() {
  const { user } = useBank();
  if (!user) return null;

  return (
    <div className="container">
      <div className="section-head">
        <h2>Insights</h2>
      </div>
      <div className="charts">
        <div className="chart-card">
          <h3>Spending by category</h3>
          <CategoryChart transactions={user.transactions} />
        </div>
        <div className="chart-card">
          <h3>Net balance over time</h3>
          <BalanceChart accounts={user.accounts} transactions={user.transactions} />
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <RequireAuth>
      <TopBar />
      <InsightsContent />
    </RequireAuth>
  );
}
