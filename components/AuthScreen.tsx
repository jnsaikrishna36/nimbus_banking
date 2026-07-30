"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "./AuthProvider";

type Mode = "login" | "register" | "forgot";

export function AuthScreen() {
  const { login, register, requestReset, completeReset } = useBank();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginInfo, setLoginInfo] = useState("");

  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");
  const [regInfo, setRegInfo] = useState("");

  const [fpStep, setFpStep] = useState<"request" | "verify">("request");
  const [fpUser, setFpUser] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpPass, setFpPass] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpIssuedCode, setFpIssuedCode] = useState("");
  const [fpError, setFpError] = useState("");

  function handleLogin() {
    setLoginError("");
    setLoginInfo("");
    const r = login(loginUser.trim(), loginPass);
    if (r.error) return setLoginError(r.error);
    router.push("/dashboard");
  }

  function handleRegister() {
    setRegError("");
    setRegInfo("");
    const r = register(regName.trim(), regUser.trim(), regPass);
    if (r.error) return setRegError(r.error);
    setRegInfo("Account created! Signing you in…");
    const username = regUser.trim();
    const password = regPass;
    setTimeout(() => {
      login(username, password);
      router.push("/dashboard");
    }, 600);
  }

  function openForgot() {
    setFpStep("request");
    setFpUser(loginUser.trim());
    setFpCode("");
    setFpPass("");
    setFpConfirm("");
    setFpIssuedCode("");
    setFpError("");
    setMode("forgot");
  }

  function backToLogin(info = "") {
    setLoginError("");
    setLoginInfo(info);
    setMode("login");
  }

  function handleRequestCode() {
    setFpError("");
    const username = fpUser.trim();
    const r = requestReset(username);
    if (r.error) return setFpError(r.error);
    setFpIssuedCode(r.code ?? "");
    setFpCode("");
    setFpStep("verify");
  }

  function handleResetPassword() {
    setFpError("");
    if (fpPass !== fpConfirm) return setFpError("Those passwords don't match.");
    const username = fpUser.trim();
    const r = completeReset(username, fpCode, fpPass);
    if (r.error) return setFpError(r.error);
    setLoginUser(username);
    setLoginPass("");
    setFpIssuedCode("");
    backToLogin("Password updated. Sign in with your new password.");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div className="brand-name">Nimbus Bank</div>
        </div>

        {mode === "login" && (
          <div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-sub">Sign in to continue to your accounts.</p>
            {loginError && <div className="error">{loginError}</div>}
            {loginInfo && <div className="info">{loginInfo}</div>}
            <div className="field">
              <label>Username</label>
              <input value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="e.g. alex" />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleLogin}>
              Sign in
            </button>
            <p className="auth-switch">
              <a onClick={openForgot}>Forgot password?</a>
            </p>
            <p className="auth-switch">
              No account? <a onClick={() => setMode("register")}>Create one</a>
            </p>
          </div>
        )}

        {mode === "register" && (
          <div>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-sub">You&apos;ll get a Checking, Savings &amp; Credit account.</p>
            {regError && <div className="error">{regError}</div>}
            {regInfo && <div className="info">{regInfo}</div>}
            <div className="field">
              <label>Full name</label>
              <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Alex Morgan" />
            </div>
            <div className="field">
              <label>Username</label>
              <input value={regUser} onChange={(e) => setRegUser(e.target.value)} placeholder="alex" />
            </div>
            <div className="field">
              <label>Password (min 4 chars)</label>
              <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleRegister}>
              Create account
            </button>
            <p className="auth-switch">
              Already have one? <a onClick={() => setMode("login")}>Sign in</a>
            </p>
          </div>
        )}

        {mode === "forgot" && (
          <div>
            <h2 className="auth-title">Reset your password</h2>
            {fpError && <div className="error">{fpError}</div>}

            {fpStep === "request" ? (
              <>
                <p className="auth-sub">
                  Tell us your username and we&apos;ll issue a one-time reset code.
                </p>
                <div className="field">
                  <label>Username</label>
                  <input
                    value={fpUser}
                    onChange={(e) => setFpUser(e.target.value)}
                    placeholder="e.g. alex"
                  />
                </div>
                <button className="btn btn-primary btn-block" onClick={handleRequestCode}>
                  Send reset code
                </button>
              </>
            ) : (
              <>
                <p className="auth-sub">
                  Enter the code for <strong>{fpUser.trim()}</strong> and pick a new password.
                </p>
                {fpIssuedCode && (
                  <div className="info">
                    Demo mode — no email is sent. Your code is <strong>{fpIssuedCode}</strong>, valid
                    for 15 minutes.
                  </div>
                )}
                <div className="field">
                  <label>Reset code</label>
                  <input
                    value={fpCode}
                    onChange={(e) => setFpCode(e.target.value)}
                    inputMode="numeric"
                    placeholder="6-digit code"
                  />
                </div>
                <div className="field">
                  <label>New password (min 4 chars)</label>
                  <input
                    type="password"
                    value={fpPass}
                    onChange={(e) => setFpPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="field">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    value={fpConfirm}
                    onChange={(e) => setFpConfirm(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button className="btn btn-primary btn-block" onClick={handleResetPassword}>
                  Update password
                </button>
                <button className="btn btn-ghost btn-block" onClick={handleRequestCode}>
                  Resend code
                </button>
              </>
            )}

            <p className="auth-switch">
              <a onClick={() => backToLogin()}>Back to sign in</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
