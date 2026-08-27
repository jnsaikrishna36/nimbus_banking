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
