import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendVerification, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unverifiedState, setUnverifiedState] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // If already logged in, show logged-in state or redirect
  if (isAuthenticated && user) {
    return (
      <div className="storefront-container py-16 sm:py-24 max-w-md mx-auto text-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-xl font-bold m-0">You're already logged in</h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 mb-6">
            Signed in as <strong className="text-[var(--text-primary)]">{user.email}</strong> ({user.fullName || user.name})
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => (onNavigate ? onNavigate("profile") : navigate("/profile"))}
              className="btn btn-primary w-full py-2.5 text-xs font-semibold"
            >
              Manage Profile
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate("home") : navigate("/"))}
              className="btn btn-secondary w-full py-2.5 text-xs font-semibold"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setUnverifiedState(false);

      const res = await login(email, password);

      // Successfully authenticated
      const returnUrl = location.state?.from;
      if (returnUrl) {
        navigate(returnUrl);
      } else if (onNavigate) {
        onNavigate("home");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.unverified) {
        setUnverifiedState(true);
        setError(err.message || "Please verify your email before logging in.");
      } else if (err.incompleteProfile) {
        // Redirect to setup profile with setup token
        sessionStorage.setItem("pixel_setup_token", err.setupToken || "");
        sessionStorage.setItem("pixel_setup_email", err.email || email);
        if (onNavigate) {
          onNavigate("setup-profile");
        } else {
          navigate("/setup-profile");
        }
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    try {
      setResending(true);
      await resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 8000);
    } catch (err) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="storefront-container py-12 sm:py-20 max-w-md mx-auto">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[0.675rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Account Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-[-0.03em] text-[var(--text-primary)]">
            Sign In to Pixel
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Log in to manage your profile, view orders, and track inquiries.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-[var(--radius-sm)] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <div>{error}</div>
              {unverifiedState && (
                <div className="mt-2.5 pt-2 border-t border-rose-500/20">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="btn btn-secondary btn-sm !py-1 !px-2.5 text-[0.7rem] gap-1.5 font-semibold text-white"
                  >
                    {resending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    <span>{resending ? "Sending..." : "Resend Activation Email"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resend success notice */}
        {resendSuccess && (
          <div className="mb-5 p-3.5 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle size={15} className="shrink-0" />
            <span>Verification email resent! Please check your inbox or spam.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Email Address
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
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
          Don't have an account yet?{" "}
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate("register") : navigate("/register"))}
            className="font-bold text-[var(--text-primary)] hover:underline ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
