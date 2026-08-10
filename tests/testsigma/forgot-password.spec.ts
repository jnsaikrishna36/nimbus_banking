/**
 * forgot-password.spec.ts
 *
 * Covers the Nimbus Bank self-service password reset:
 *   register → sign out → request a one-time code → reset → sign in again.
 *
 * The reset code is generated per request, so it is read off the confirmation
 * banner with getElementProp() and replayed through runtime — the spec is
 * statically compiled, so it can never compute the code itself.
 *
 * Nimbus keeps its whole database in localStorage, so the run starts by
 * clearing it. Without that, the second run of this spec would fail on
 * "That username is already taken."
 */
import {
  element,
  expect,
  getElementProp,
  runtime,
  step,
  test,
} from "@testsigma/code";

// ── Auth screen: shared ───────────────────────────────────────────────────────

const welcomeHeading = element({
  name: "Welcome back heading",
  locator: { xpath: "//h2[text()='Welcome back']" },
});

const infoBanner = element({
  name: "Info banner",
  locator: { xpath: "//div[@class='info']" },
});

const errorBanner = element({
  name: "Error banner",
  locator: { xpath: "//div[@class='error']" },
});

// The username field is labelled "Username" on both the sign-in and the
// reset-request steps, and only one of them is ever mounted.
const usernameField = element({
  name: "Username field",
  locator: { xpath: "//label[text()='Username']/following-sibling::input" },
});

// ── Sign in ───────────────────────────────────────────────────────────────────

const passwordField = element({
  name: "Password field",
  locator: { xpath: "//label[text()='Password']/following-sibling::input" },
});

const signInButton = element({
  name: "Sign in button",
  locator: { xpath: "//button[text()='Sign in']" },
});

const forgotPasswordLink = element({
  name: "Forgot password link",
  locator: { xpath: "//a[text()='Forgot password?']" },
});

// ── Register ──────────────────────────────────────────────────────────────────

const createOneLink = element({
  name: "Create one link",
  locator: { xpath: "//a[text()='Create one']" },
});

const fullNameField = element({
  name: "Full name field",
  locator: { xpath: "//label[text()='Full name']/following-sibling::input" },
});

const registerPasswordField = element({
  name: "Register password field",
  locator: {
    xpath: "//label[text()='Password (min 4 chars)']/following-sibling::input",
  },
});

const createAccountButton = element({
  name: "Create account button",
  locator: { xpath: "//button[text()='Create account']" },
});

// ── Reset your password ───────────────────────────────────────────────────────

const sendResetCodeButton = element({
  name: "Send reset code button",
  locator: { xpath: "//button[text()='Send reset code']" },
});

const issuedCode = element({
  name: "Issued reset code",
  locator: { xpath: "//div[@class='info']/strong" },
});

const resetCodeField = element({
  name: "Reset code field",
  locator: { xpath: "//label[text()='Reset code']/following-sibling::input" },
});

const newPasswordField = element({
  name: "New password field",
  locator: {
    xpath:
      "//label[text()='New password (min 4 chars)']/following-sibling::input",
  },
});

const confirmPasswordField = element({
  name: "Confirm new password field",
  locator: {
    xpath: "//label[text()='Confirm new password']/following-sibling::input",
  },
});

const updatePasswordButton = element({
  name: "Update password button",
  locator: { xpath: "//button[text()='Update password']" },
});

// ── Signed-in shell ───────────────────────────────────────────────────────────

const signOutButton = element({
  name: "Sign out button",
  locator: { xpath: "//button[text()='Sign out']" },
});

test("Forgot password: reset with a one-time code and sign in again", ({
  page,
}) => {
  page.goto("http://localhost:3000");
  page.deleteLocalStorage();
  page.reload();

  step("Register a new account", () => {
    createOneLink.click();
    fullNameField.fill("Reset Probe");
    usernameField.fill("resetprobe");
    registerPasswordField.fill("orig1234");
    createAccountButton.click();
    expect(page).toContainURL("/dashboard");
  });

  step("Sign out", () => {
    signOutButton.click();
    expect(welcomeHeading).toBeVisible();
  });

  step("Requesting a code for an unknown user is refused", () => {
    forgotPasswordLink.click();
    usernameField.fill("nosuchuser");
    sendResetCodeButton.click();
    expect(errorBanner).toHaveText("No account found with that username.");
  });

  step("Request a one-time reset code", () => {
    usernameField.fill("resetprobe");
    sendResetCodeButton.click();
    expect(resetCodeField).toBeVisible();
    runtime.resetCode = getElementProp(issuedCode, { prop: "text" });
  });

  step("A wrong code is rejected and costs an attempt", () => {
    resetCodeField.fill("000000");
    newPasswordField.fill("fresh5678");
    confirmPasswordField.fill("fresh5678");
    updatePasswordButton.click();
    expect(errorBanner).toContainText("Incorrect code");
  });

  step("Mismatched confirmation is rejected", () => {
    resetCodeField.fill(runtime.resetCode);
    newPasswordField.fill("fresh5678");
    confirmPasswordField.fill("different");
    updatePasswordButton.click();
    expect(errorBanner).toContainText("passwords don't match");
  });

  step("A too-short password is rejected without burning the code", () => {
    newPasswordField.fill("ab");
    confirmPasswordField.fill("ab");
    updatePasswordButton.click();
    expect(errorBanner).toContainText("at least 4 characters");
  });

  step("The correct code resets the password", () => {
    resetCodeField.fill(runtime.resetCode);
    newPasswordField.fill("fresh5678");
    confirmPasswordField.fill("fresh5678");
    updatePasswordButton.click();
    expect(welcomeHeading).toBeVisible();
    expect(infoBanner).toHaveText(
      "Password updated. Sign in with your new password."
    );
  });

  step("The old password no longer works", () => {
    usernameField.fill("resetprobe");
    passwordField.fill("orig1234");
    signInButton.click();
    expect(errorBanner).toHaveText("Invalid username or password.");
  });

  step("The new password signs in", () => {
    usernameField.fill("resetprobe");
    passwordField.fill("fresh5678");
    signInButton.click();
    expect(page).toContainURL("/dashboard");
    expect(signOutButton).toBeVisible();
  });
});
