import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Send,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function VerifyEmailPage({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in URL. Please check your email link.");
      return;
    }

    let isMounted = true;

    const performVerification = async () => {
      try {
        const res = await verifyEmail(token);
        if (isMounted) {
          setStatus("success");
          setMessage(res.message || "Email verified successfully!");

          // Store temporary verification data for setup profile step
          if (res.token) {
            sessionStorage.setItem("pixel_setup_token", res.token);
          }
          if (res.email) {
            sessionStorage.setItem("pixel_setup_email", res.email);
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          setMessage(
            err.message ||
              "Activation link is invalid or has expired. Please request a new verification email."
          );
        }
      }
    };

    performVerification();

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  const handleProceedToSetup = () => {
    if (onNavigate) {
      onNavigate("setup-profile");
    } else {
      navigate("/setup-profile");
    }
  };

  const handleResend = async (e) => {
    e?.preventDefault?.();
    if (!resendEmail) return;

    try {
      setResending(true);
      await resendVerification(resendEmail);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 8000);
    } catch (err) {
      setMessage(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="storefront-container py-16 sm:py-24 max-w-md mx-auto">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-2xl text-center">
        {/* State: Verifying */}
        {status === "verifying" && (
          <div className="py-6">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 size={26} className="animate-spin text-white" />
            </div>
            <h2 className="text-xl font-bold m-0">Verifying Email...</h2>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Please wait while we validate your activation token.
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="animate-[scaleUp_0.2s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>

            <span className="text-[0.675rem] font-bold uppercase tracking-[0.16em] text-emerald-400">
              Email Confirmed
            </span>
            <h2 className="text-2xl font-extrabold mt-1 mb-2 tracking-[-0.02em]">
              Account Verified!
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              Your email address has been verified. Please complete your account profile details to finish activating your account.
            </p>

            <button
              type="button"
              onClick={handleProceedToSetup}
              className="btn btn-primary w-full py-3 text-xs sm:text-sm font-bold gap-2 shadow-md cursor-pointer"
            >
              <span>Setup Your Profile</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="animate-[scaleUp_0.2s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>

            <span className="text-[0.675rem] font-bold uppercase tracking-[0.16em] text-rose-400">
              Verification Issue
            </span>
            <h2 className="text-2xl font-extrabold mt-1 mb-2 tracking-[-0.02em]">
              Link Expired or Invalid
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
              {message}
            </p>

            {resendSuccess ? (
              <div className="mb-4 p-3 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2">
                <CheckCircle size={14} />
                <span>New activation link sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleResend} className="flex flex-col gap-3 mb-4 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Enter your email to get a new link
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={15}
                    className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="form-input !pl-9.5 text-xs py-2 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending}
                  className="btn btn-secondary w-full py-2.5 text-xs font-semibold gap-1.5"
                >
                  {resending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  <span>{resending ? "Sending..." : "Request New Activation Link"}</span>
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("login") : navigate("/login"))}
              className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
