"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "./AuthProvider";

export function AuthScreen() {
  const { login, register } = useBank();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");
  const [regInfo, setRegInfo] = useState("");

  function handleLogin() {
    setLoginError("");
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

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div className="brand-name">Nimbus Bank</div>
        </div>

        {mode === "login" ? (
          <div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-sub">Sign in to continue to your accounts.</p>
            {loginError && <div className="error">{loginError}</div>}
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
              No account?{" "}
              <a data-testid="switch-to-register" onClick={() => setMode("register")}>
                Create one
              </a>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-sub">You&apos;ll get a Checking, Savings &amp; Credit account.</p>
            {regError && (
              <div className="error" data-testid="register-error">
                {regError}
              </div>
            )}
            {regInfo && <div className="info">{regInfo}</div>}
            <div className="field">
              <label>Full name</label>
              <input
                data-testid="register-name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Alex Morgan"
              />
            </div>
            <div className="field">
              <label>Username</label>
              <input
                data-testid="register-username"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                placeholder="alex"
              />
            </div>
            <div className="field">
              <label>Password (min 4 chars)</label>
              <input
                data-testid="register-password"
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              data-testid="register-submit"
              className="btn btn-primary btn-block"
              onClick={handleRegister}
            >
              Create account
            </button>
            <p className="auth-switch">
              Already have one? <a onClick={() => setMode("login")}>Sign in</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
