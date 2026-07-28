"use client";

import { useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { TopBar } from "@/components/TopBar";
import { useBank } from "@/components/AuthProvider";
import { currency } from "@/lib/format";

function TransferContent() {
  const { user, transfer } = useBank();
  const [fromId, setFromId] = useState(user?.accounts[0]?.id ?? "");
  const [toId, setToId] = useState(user?.accounts[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!user) return null;

  function handleSubmit() {
    setError("");
    setInfo("");
    const amt = parseFloat(amount);
    const r = transfer(fromId, toId, amt, description);
    if (r.error) return setError(r.error);
    setInfo(r.info || "");
    setAmount("");
    setDescription("");
  }

  return (
    <div className="container">
      <div className="section-head">
        <h2>Transfer money</h2>
      </div>
      <div className="card" style={{ maxWidth: 560 }}>
        {error && <div className="error">{error}</div>}
        {info && <div className="info">{info}</div>}
        <div className="form-row">
          <div className="field">
            <label>From</label>
            <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
              {user.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({currency.format(a.balance)})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>To</label>
            <select value={toId} onChange={(e) => setToId(e.target.value)}>
              {user.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({currency.format(a.balance)})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="field">
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rent, groceries…"
            />
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Send transfer
          </button>
          <Link href="/dashboard" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  return (
    <RequireAuth>
      <TopBar />
      <TransferContent />
    </RequireAuth>
  );
}
