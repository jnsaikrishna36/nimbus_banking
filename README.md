# Nimbus Bank

A self-contained demo banking application built with Next.js (App Router), TypeScript, and Tailwind CSS. All data — accounts, transactions, and the demo user store — lives in the browser's `localStorage`; there is no backend.

## Features

- Sign up / sign in (toy password hashing — demo only, not secure)
- Dashboard with Checking, Savings, and Credit accounts
- Transfers between your own accounts
- Transaction history with account / category / text filters
- Spending and net-balance insights via Chart.js
- One-click demo transaction seeding

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/          Next.js App Router pages (auth, dashboard, transfer, history, insights)
components/   Reusable UI components and the bank data context
lib/          localStorage-backed data helpers and formatters
mocks/        Demo transaction seed data
types/        Shared TypeScript types
public/       Static assets
```

## Notes

This is a demo/prototype app. Passwords are hashed with a toy (non-cryptographic) hash for demo purposes only — do not reuse this pattern for anything real.
