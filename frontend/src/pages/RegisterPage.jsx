import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function RegisterPage({ onNavigate }) {
  const navigate = useNavigate();
  const { register, resendVerification } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanEmail = (email || "").toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }

    try {
      setLoading(true);
      const res = await register(cleanEmail, password);
      setRegisteredEmail(cleanEmail);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    try {
      setResending(true);
      await resendVerification(registeredEmail);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 8000);
    } catch (err) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  // If successfully registered, show confirmation screen
  if (registeredEmail) {
    return (
      <div className="storefront-container py-12 sm:py-20 max-w-md mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-2xl text-center animate-[scaleUp_0.2s_ease-out]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <Mail size={32} />
          </div>

          <span className="text-[0.675rem] font-bold uppercase tracking-[0.16em] text-emerald-400">
            Activation Required
          </span>
          <h2 className="text-2xl font-extrabold mt-1 mb-2 tracking-[-0.02em]">
            Check Your Email
          </h2>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
            We have dispatched an activation link to:
          </p>

          <div className="p-3 bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] mb-6 select-all break-all">
            {registeredEmail}
          </div>

          <div className="text-left bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-2 mb-6">
            <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>Next Steps:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 m-0 leading-relaxed">
              <li>Open your Gmail or email inbox (check Spam if needed).</li>
              <li>Click <strong>Activate &amp; Verify Account</strong>.</li>
              <li>Complete your profile setup (full name, phone, address, landmark, and birth date).</li>
            </ol>
          </div>

          {resendSuccess && (
            <div className="mb-4 p-2.5 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2">
              <CheckCircle size={14} />
              <span>Activation email resent successfully!</span>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn btn-secondary w-full py-2.5 text-xs font-semibold gap-1.5"
            >
              {resending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              <span>{resending ? "Resending email..." : "Resend Activation Email"}</span>
            </button>

            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("login") : navigate("/login"))}
              className="btn btn-primary w-full py-2.5 text-xs font-semibold gap-1.5"
            >
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="storefront-container py-12 sm:py-20 max-w-md mx-auto">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[0.675rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Join Pixel Perfect
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-[-0.03em] text-[var(--text-primary)]">
            Create Account
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Register with your email to unlock inquiries, fast ordering, and member privileges.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-[var(--radius-sm)] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
            <span className="text-[0.675rem] text-[var(--text-muted)] mt-1 block">
              We'll send an activation link to this email.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input !pl-9.5 !pr-10 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your password"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-xs sm:text-sm font-bold gap-2 mt-2 shadow-md cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ArrowRight size={16} />
            )}
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate("login") : navigate("/login"))}
            className="font-bold text-[var(--text-primary)] hover:underline ml-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
