"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBank } from "./AuthProvider";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transfer", label: "Transfer" },
  { href: "/history", label: "History" },
  { href: "/insights", label: "Insights" },
];

export function TopBar() {
  const { user, logout } = useBank();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="topbar">
      <div className="top-left">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div className="brand-name">Nimbus Bank</div>
        </div>
        <div className="nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${pathname === item.href ? " active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="user-chip">
          <div className="avatar">{(user.name || user.username).slice(0, 1).toUpperCase()}</div>
          <div style={{ fontSize: 13 }}>{user.name}</div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
