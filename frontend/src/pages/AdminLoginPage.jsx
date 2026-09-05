import React, { useState } from "react";
import { Lock, ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminLoginPage({ onBackToStore, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { adminLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await adminLogin(trimmedEmail, trimmedPassword);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-lg)] p-8 sm:p-10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] inline-flex items-center justify-center mb-3 font-extrabold text-xl shadow-xs">
            P
          </div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] m-0 mb-1 text-[var(--text-primary)]">
            Pixel Perfect Studio
          </h2>
          <span className="text-[0.75rem] text-[var(--text-muted)] uppercase tracking-[0.08em]">
            Protected Administrative Portal
          </span>
        </div>

        {error && (
          <div className="p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-xs mb-5 flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <div className="form-group !mb-0">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pixelperfect.com"
            />
          </div>

          <div className="form-group !mb-0">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 mt-2 gap-1.5"
          >
            <KeyRound size={15} />
            <span>{isLoading ? "Authenticating..." : "Access Studio"}</span>
          </button>
        </form>


        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToStore}
            className="btn btn-ghost btn-sm text-[var(--text-muted)] gap-1.5"
          >
            <ArrowLeft size={13} />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
}
