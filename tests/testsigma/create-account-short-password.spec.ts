/**
 * create-account-short-password.spec.ts
 *
 * Negative test: registering with a password shorter than 4 characters
 * must be rejected by the Nimbus Bank account creation form.
 */
import { expect, test } from "@testsigma/code";
import {
  registerNameInput,
  registerPasswordInput,
  registerSubmitButton,
  registerUsernameInput,
  registerErrorBanner,
  switchToRegisterLink,
} from "./elements/auth.js";

test("Register fails when password is shorter than 4 characters", ({ page }) => {
  page.goto("http://localhost:3001");
  switchToRegisterLink.click();

  registerNameInput.fill("Short Password User");
  registerUsernameInput.fill("shortpassuser01");
  registerPasswordInput.fill("abc");
  registerSubmitButton.click();

  expect(registerErrorBanner).toBeVisible();
  expect(registerErrorBanner).toHaveText("Password must be at least 4 characters.");
  expect(page).toContainURL("http://localhost:3001");
});
