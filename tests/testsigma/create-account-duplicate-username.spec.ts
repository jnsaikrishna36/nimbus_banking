/**
 * create-account-duplicate-username.spec.ts
 *
 * Negative test: registering with a username that already exists must be
 * rejected by the Nimbus Bank account creation form. A first registration
 * is performed to guarantee the username exists, then the user signs out
 * and repeats registration with the same username.
 */
import { expect, test } from "@testsigma/code";
import {
  registerNameInput,
  registerPasswordInput,
  registerSubmitButton,
  registerUsernameInput,
  registerErrorBanner,
  signOutButton,
  switchToRegisterLink,
} from "./elements/auth.js";

test("Register fails when the username already exists", ({ page }) => {
  page.goto("http://localhost:3001");
  switchToRegisterLink.click();

  registerNameInput.fill("Duplicate User");
  registerUsernameInput.fill("dupuser01");
  registerPasswordInput.fill("validpass1");
  registerSubmitButton.click();

  // First registration succeeds and signs the user in.
  expect(page).toContainURL("/dashboard");

  // Sign back out so the account creation form is reachable again.
  signOutButton.click();
  expect(page).toContainURL("http://localhost:3001");

  // Re-register with the same username — this must be rejected.
  switchToRegisterLink.click();
  registerNameInput.fill("Duplicate User Again");
  registerUsernameInput.fill("dupuser01");
  registerPasswordInput.fill("anotherpass1");
  registerSubmitButton.click();

  expect(registerErrorBanner).toBeVisible();
  expect(registerErrorBanner).toHaveText("That username is already taken.");
});
