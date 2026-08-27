import { element } from "@testsigma/code";

// Login / register card (components/AuthScreen.tsx)
export const usernameInput = element({
  name: "Username input",
  locator: { csspath: ".auth-card input[placeholder='e.g. alex']" },
});

export const passwordInput = element({
  name: "Password input",
  locator: { csspath: ".auth-card input[type='password']" },
});

export const signInButton = element({
  name: "Sign in button",
  locator: { csspath: ".auth-card .btn.btn-primary.btn-block" },
});

export const loginError = element({
  name: "Login error message",
  locator: { csspath: ".auth-card .error" },
});

export const createAccountLink = element({
  name: "Create one link",
  locator: { xpath: "//a[text()='Create one']" },
});

export const fullNameInput = element({
  name: "Full name input",
  locator: { csspath: ".auth-card input[placeholder='Alex Morgan']" },
});

export const registerUsernameInput = element({
  name: "Register username input",
  locator: { csspath: ".auth-card input[placeholder='alex']" },
});

export const createAccountButton = element({
  name: "Create account button",
  locator: { csspath: ".auth-card .btn.btn-primary.btn-block" },
});

// Top bar (components/TopBar.tsx) — shown once signed in
export const userChip = element({
  name: "User chip",
  locator: { csspath: ".user-chip" },
});

export const signOutButton = element({
  name: "Sign out button",
  locator: { csspath: ".topbar .btn.btn-ghost" },
});
