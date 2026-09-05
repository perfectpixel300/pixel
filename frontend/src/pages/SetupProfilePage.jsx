import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Compass,
  Calendar,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CountryPhoneInput } from "../components/common/CountryPhoneInput";
import { validatePhoneNumber } from "../utils/phoneValidation";

export function SetupProfilePage({ onNavigate, showToast }) {
  const navigate = useNavigate();
  const { user, setupProfile } = useAuth();

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [tempToken, setTempToken] = useState("");

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+977");
  const [contactNumber, setContactNumber] = useState("");
  const [secondaryCountryCode, setSecondaryCountryCode] = useState("+977");
  const [secondaryContactNumber, setSecondaryContactNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [nearbyLandmark, setNearbyLandmark] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("pixel_setup_email") || user?.email || "";
    const storedToken = sessionStorage.getItem("pixel_setup_token") || "";

    setVerifiedEmail(storedEmail);
    setTempToken(storedToken);

    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.countryCode) setCountryCode(user.countryCode);
      if (user.contactNumber) setContactNumber(user.contactNumber);
      if (user.secondaryCountryCode) setSecondaryCountryCode(user.secondaryCountryCode);
      if (user.secondaryContactNumber) setSecondaryContactNumber(user.secondaryContactNumber);
      if (user.currentAddress) setCurrentAddress(user.currentAddress);
      if (user.nearbyLandmark) setNearbyLandmark(user.nearbyLandmark);
      if (user.dateOfBirth) setDateOfBirth(user.dateOfBirth);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // Verify Primary Contact Number
    const primaryValidation = validatePhoneNumber(contactNumber, countryCode);
    if (!primaryValidation.isValid) {
      setError(`Primary Contact Number: ${primaryValidation.message}`);
      return;
    }

    // Verify Secondary Contact Number (if entered)
    let cleanSecondary = "";
    if (secondaryContactNumber && secondaryContactNumber.trim()) {
      const secondaryValidation = validatePhoneNumber(secondaryContactNumber, secondaryCountryCode);
      if (!secondaryValidation.isValid) {
        setError(`Secondary Contact Number: ${secondaryValidation.message}`);
        return;
      }
      cleanSecondary = secondaryValidation.cleanNumber;
    }

    if (!currentAddress.trim()) {
      setError("Please enter your current delivery/residence address.");
      return;
    }
    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    try {
      setLoading(true);
      const profileData = {
        fullName: fullName.trim(),
        countryCode,
        contactNumber: primaryValidation.cleanNumber,
        secondaryCountryCode,
        secondaryContactNumber: cleanSecondary,
        currentAddress: currentAddress.trim(),
        nearbyLandmark: (nearbyLandmark || "").trim(),
        dateOfBirth,
      };

      const res = await setupProfile(profileData, tempToken);

      sessionStorage.removeItem("pixel_setup_token");
      sessionStorage.removeItem("pixel_setup_email");

      if (showToast) {
        showToast("Account activated successfully! Welcome to Pixel Perfect.");
      }

      if (onNavigate) {
        onNavigate("home");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Setup profile error:", err);
      setError(err.message || "Failed to complete account setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storefront-container py-12 sm:py-20 max-w-lg mx-auto">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-2xl">
        {/* Step Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <CheckCircle size={13} />
            <span>Email Verified Successfully</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            Complete Account Setup
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Fill in your profile details to finalize your membership and enable instant orders.
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          {/* Email (Read-only Verified) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Address
              </label>
              <span className="text-[0.68rem] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12} />
                <span>Verified</span>
              </span>
            </div>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-3 text-emerald-400 pointer-events-none"
              />
              <input
                type="email"
                disabled
                value={verifiedEmail || "Verified Email"}
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-elevated)] opacity-80 cursor-not-allowed border border-emerald-500/30 text-zinc-300 font-mono"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <User
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Primary Contact Number (Required with Country Selector) */}
          <CountryPhoneInput
            label="Primary Contact Number"
            required={true}
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            value={contactNumber}
            onChange={setContactNumber}
          />

          {/* Secondary Contact Number (Optional with Country Selector) */}
          <CountryPhoneInput
            label="Secondary Contact Number"
            required={false}
            countryCode={secondaryCountryCode}
            onCountryCodeChange={setSecondaryCountryCode}
            value={secondaryContactNumber}
            onChange={setSecondaryContactNumber}
          />

          {/* Current Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Current Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <MapPin
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="text"
                required
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="e.g. New Baneshwor, Kathmandu"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Nearby Landmark */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Nearby Landmark
              </label>
              <span className="text-[0.675rem] text-[var(--text-muted)]">Optional</span>
            </div>
            <div className="relative flex items-center">
              <Compass
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="text"
                value={nearbyLandmark}
                onChange={(e) => setNearbyLandmark(e.target.value)}
                placeholder="e.g. Opposite to Civil Bank, Near Eye Hospital"
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Date of Birth <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <Calendar
                size={16}
                className="absolute left-3 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="form-input !pl-9.5 text-xs sm:text-sm py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-xs sm:text-sm font-bold gap-2 mt-3 shadow-lg cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            <span>{loading ? "Activating Account..." : "Activate Account & Finish"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
