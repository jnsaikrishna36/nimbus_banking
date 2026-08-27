/**
 * login-success.spec.ts
 *
 * Login scenario for Nimbus Bank (app/page.tsx -> components/AuthScreen.tsx).
 * The app has no backend — accounts live in the browser's localStorage — so
 * the test clears local storage first, registers a fresh account, signs out,
 * then signs back in through the login form.
 */
import { expect, runtime, step, test } from "@testsigma/code";
import {
  createAccountButton,
  createAccountLink,
  fullNameInput,
  passwordInput,
  registerUsernameInput,
  signInButton,
  signOutButton,
  userChip,
  usernameInput,
} from "./elements/auth.js";

test("sign in with a registered account reaches the dashboard", ({ page }) => {
  runtime.testName = "Alex Morgan";
  runtime.testUsername = "alex.morgan";
  runtime.testPassword = "s3cret1";

  step("Register a fresh account", () => {
    page.goto("http://localhost:3000");
    page.deleteLocalStorage();
    page.reload();

    createAccountLink.click();
    fullNameInput.fill(runtime.testName);
    registerUsernameInput.fill(runtime.testUsername);
    passwordInput.fill(runtime.testPassword);
    createAccountButton.click();

    expect(page).toContainURL("/dashboard");
    expect(userChip).toContainText(runtime.testName);
  });

  step("Sign out", () => {
    signOutButton.click();
    expect(usernameInput).toBeVisible();
  });

  step("Sign in with the same credentials", () => {
    usernameInput.fill(runtime.testUsername);
    passwordInput.fill(runtime.testPassword);
    signInButton.click();
  });

  expect(page).toContainURL("/dashboard");
  expect(userChip).toContainText(runtime.testName);
});
