/**
 * login-invalid-password.spec.ts
 *
 * Negative login scenario for Nimbus Bank: a registered account signing in
 * with the wrong password sees an error and stays on the login screen.
 */
import { expect, runtime, step, test } from "@testsigma/code";
import {
  createAccountButton,
  createAccountLink,
  fullNameInput,
  loginError,
  passwordInput,
  registerUsernameInput,
  signInButton,
  signOutButton,
  usernameInput,
} from "./elements/auth.js";

test("sign in with a wrong password shows an error and stays on the login screen", ({ page }) => {
  runtime.testUsername = "alex.morgan";
  runtime.testPassword = "s3cret1";

  step("Register a fresh account", () => {
    page.goto("http://localhost:3000");
    page.deleteLocalStorage();
    page.reload();

    createAccountLink.click();
    fullNameInput.fill("Alex Morgan");
    registerUsernameInput.fill(runtime.testUsername);
    passwordInput.fill(runtime.testPassword);
    createAccountButton.click();

    expect(page).toContainURL("/dashboard");
  });

  step("Sign out", () => {
    signOutButton.click();
    expect(usernameInput).toBeVisible();
  });

  step("Attempt sign in with an incorrect password", () => {
    usernameInput.fill(runtime.testUsername);
    passwordInput.fill("not-the-right-password");
    signInButton.click();
  });

  expect(loginError).toBeVisible();
  expect(loginError).toHaveText("Invalid username or password.");
  expect(usernameInput).toBeVisible();
});
