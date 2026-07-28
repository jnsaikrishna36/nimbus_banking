"use client";

import { useBank } from "./AuthProvider";

export function Footer() {
  const { user } = useBank();
  if (!user) return null;
  return <div className="footer">Nimbus Bank — demo only. All data is stored locally in your browser.</div>;
}
