import { element } from "@testsigma/code";

export const switchToRegisterLink = element({
  name: "Create one (switch to register)",
  locator: { csspath: "[data-testid='switch-to-register']" },
});

export const registerNameInput = element({
  name: "Register full name",
  locator: { csspath: "[data-testid='register-name']" },
});

export const registerUsernameInput = element({
  name: "Register username",
  locator: { csspath: "[data-testid='register-username']" },
});

export const registerPasswordInput = element({
  name: "Register password",
  locator: { csspath: "[data-testid='register-password']" },
});

export const registerSubmitButton = element({
  name: "Create account button",
  locator: { csspath: "[data-testid='register-submit']" },
});

export const registerErrorBanner = element({
  name: "Register error banner",
  locator: { csspath: "[data-testid='register-error']" },
});

export const signOutButton = element({
  name: "Sign out button",
  locator: { csspath: "[data-testid='sign-out']" },
});

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

export const createAccountButton = element({
  name: "Create account button (login flow)",
  locator: { csspath: ".auth-card .btn.btn-primary.btn-block" },
});

// Top bar (components/TopBar.tsx) — shown once signed in
export const userChip = element({
  name: "User chip",
  locator: { csspath: ".user-chip" },
});
