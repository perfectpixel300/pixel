import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Compass,
  Calendar,
  CheckCircle,
  Save,
  LogOut,
  Shield,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Trash2,
  Lock,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CountryPhoneInput } from "../components/common/CountryPhoneInput";
import { validatePhoneNumber } from "../utils/phoneValidation";

export function ProfilePage({ onNavigate, showToast }) {
  const navigate = useNavigate();
  const { user, updateProfile, requestDeletion, cancelDeletion, logout, isAuthenticated } = useAuth();
  const { openCart, totalItems } = useCart();

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+977");
  const [contactNumber, setContactNumber] = useState("");
  const [secondaryCountryCode, setSecondaryCountryCode] = useState("+977");
  const [secondaryContactNumber, setSecondaryContactNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [nearbyLandmark, setNearbyLandmark] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancellingDeletion, setCancellingDeletion] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || "");
      setCountryCode(user.countryCode || "+977");
      setContactNumber(user.contactNumber || "");
      setSecondaryCountryCode(user.secondaryCountryCode || "+977");
      setSecondaryContactNumber(user.secondaryContactNumber || "");
      setCurrentAddress(user.currentAddress || "");
      setNearbyLandmark(user.nearbyLandmark || "");
      setDateOfBirth(user.dateOfBirth || "");
    }
  }, [user]);

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return (
      <div className="storefront-container py-16 sm:py-24 max-w-md mx-auto text-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center mx-auto mb-4">
            <User size={26} />
          </div>
          <h2 className="text-xl font-bold m-0">Please sign in</h2>
          <p className="text-xs text-[var(--text-muted)] mt-2 mb-6">
            You need to be logged in to view and manage your profile.
          </p>
          <button
            onClick={() => (onNavigate ? onNavigate("login") : navigate("/login"))}
            className="btn btn-primary w-full py-2.5 text-xs font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // Verify Primary Contact Number (Required)
    const primaryValidation = validatePhoneNumber(contactNumber, countryCode);
    if (!primaryValidation.isValid) {
      setError(`Primary Contact Number: ${primaryValidation.message}`);
      return;
    }

    // Verify Secondary Contact Number (Optional)
    let cleanSecondary = "";
    if (secondaryContactNumber && secondaryContactNumber.trim()) {
      const secondaryValidation = validatePhoneNumber(secondaryContactNumber, secondaryCountryCode);
      if (!secondaryValidation.isValid) {
        setError(`Secondary Contact Number: ${secondaryValidation.message}`);
        return;
      }
      cleanSecondary = secondaryValidation.cleanNumber;
    }

    try {
      setSaving(true);
      await updateProfile({
        fullName: fullName.trim(),
        countryCode,
        contactNumber: primaryValidation.cleanNumber,
        secondaryCountryCode,
        secondaryContactNumber: cleanSecondary,
        currentAddress: currentAddress.trim(),
        nearbyLandmark: (nearbyLandmark || "").trim(),
        dateOfBirth,
      });

      setSaveSuccess(true);
      if (showToast) showToast("Profile updated successfully!");
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDeletion = async (e) => {
    e.preventDefault();
    setDeleteError(null);

    if (!deletePassword) {
      setDeleteError("Please enter your current password to confirm.");
      return;
    }

    try {
      setIsDeleting(true);
      await requestDeletion(deletePassword);
      setShowDeleteModal(false);
      setDeletePassword("");
      if (showToast) {
        showToast("Account deletion requested. This will take approximately 24 hours to process.");
      }
    } catch (err) {
      setDeleteError(err.message || "Failed to submit deletion request. Please verify your password.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      setCancellingDeletion(true);
      await cancelDeletion();
      if (showToast) {
        showToast("Account deletion request has been cancelled.");
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || "Failed to cancel deletion request", "error");
      }
    } finally {
      setCancellingDeletion(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (showToast) showToast("Logged out successfully.");
    if (onNavigate) {
      onNavigate("home");
    } else {
      navigate("/");
    }
  };

  const initial = (fullName || user.name || user.email || "U")[0].toUpperCase();

  return (
    <div className="storefront-container py-10 sm:py-16 max-w-3xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--border-medium)] text-[var(--text-primary)] font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg select-none">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black m-0 tracking-tight">
                  {fullName || user.name || "Valued Member"}
                </h1>
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle size={11} />
                  <span>Verified</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-1">
                {user.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex-1 sm:flex-initial"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion Status Banner (if requested) */}
      {user?.deletionRequested && (
        <div className="mb-6 p-4 sm:p-5 rounded-[var(--radius-lg)] bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200 m-0">
                Account Deletion In Progress
              </h4>
              <p className="text-xs text-amber-300/90 mt-1 mb-0 leading-relaxed">
                Your account deletion request has been submitted. It will take approximately 24 hours to process and finalize. A confirmation email has been sent to your inbox.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancelDeletion}
            disabled={cancellingDeletion}
            className="btn btn-secondary btn-sm text-xs font-semibold whitespace-nowrap self-end sm:self-center shrink-0 border-amber-500/40 hover:bg-amber-500/20 text-amber-200"
          >
            {cancellingDeletion ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" />
                <span>Cancelling...</span>
              </span>
            ) : (
              "Cancel Deletion Request"
            )}
          </button>
        </div>
      )}

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={openCart}
          className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-card)] transition-colors">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">Shopping Cart</div>
              <div className="text-[0.7rem] text-[var(--text-muted)]">
                {totalItems} {totalItems === 1 ? "item" : "items"} currently in cart
              </div>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("products") : navigate("/products"))}
          className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-card)] transition-colors">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">Browse Catalog</div>
              <div className="text-[0.7rem] text-[var(--text-muted)]">
                Explore fine stationery & prints
              </div>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 sm:p-8 shadow-xl">
        <div className="border-b border-[var(--border-subtle)] pb-4 mb-6">
          <h2 className="text-lg font-bold m-0">Profile Information</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Keep your contact details updated for order delivery and WhatsApp receipts.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-[var(--radius-sm)] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-5 p-3.5 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle size={15} />
            <span>Your profile details have been saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email (Read only) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Email Address
                </label>
                <span className="text-[0.675rem] text-emerald-400 font-bold">Verified</span>
              </div>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3 text-emerald-400 pointer-events-none" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-elevated)] opacity-75 border border-emerald-500/30 text-zinc-300 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Contact Numbers: Primary (Required) & Secondary (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountryPhoneInput
              label="Primary Contact Number"
              required={true}
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              value={contactNumber}
              onChange={setContactNumber}
            />

            <CountryPhoneInput
              label="Secondary Contact Number"
              required={false}
              countryCode={secondaryCountryCode}
              onCountryCodeChange={setSecondaryCountryCode}
              value={secondaryContactNumber}
              onChange={setSecondaryContactNumber}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Date of Birth <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Calendar size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors font-mono"
                />
              </div>
            </div>

            {/* Nearby Landmark */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Nearby Landmark <span className="text-[var(--text-muted)] lowercase font-normal">(optional)</span>
              </label>
              <div className="relative flex items-center">
                <Compass size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="text"
                  value={nearbyLandmark}
                  onChange={(e) => setNearbyLandmark(e.target.value)}
                  placeholder="Nearby popular location or landmark"
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Current Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative flex items-center">
              <MapPin size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
              <input
                type="text"
                required
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Current delivery address"
                className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-sm gap-2 !py-2.5 !px-5 text-xs font-semibold shadow-md cursor-pointer"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Account */}
        <div className="mt-10 pt-6 border-t border-rose-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 m-0">
                <AlertTriangle size={15} />
                <span>Delete Account</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-0 leading-relaxed">
                Permanently erase your account, contact details, and member history. Processing will take approximately 24 hours to finalize.
              </p>
            </div>
            {user?.deletionRequested ? (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 whitespace-nowrap">
                Deletion Pending (~24h)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDeletePassword("");
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
                className="btn btn-danger btn-sm text-xs gap-1.5 whitespace-nowrap self-end sm:self-center bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 py-2 px-3.5 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Verification Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-white m-0">
              Confirm Account Deletion
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to delete your account? This action will permanently erase your profile and stored details.
              Processing your request will take approximately 24 hours.
            </p>

            <form onSubmit={handleRequestDeletion} className="mt-4">
              {deleteError && (
                <div className="mb-3.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {deleteError}
                </div>
              )}

              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Verify with your password <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center mb-5">
                <Lock size={15} className="absolute left-3 text-zinc-500 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-zinc-950 rounded-lg border border-zinc-700 focus:border-rose-400 text-white transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-ghost btn-sm text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="btn btn-danger btn-sm text-xs gap-2 py-2 px-4 font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span>Confirm Delete</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
