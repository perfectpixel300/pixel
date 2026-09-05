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
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export function ProfilePage({ onNavigate, showToast }) {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const { openCart, totalItems } = useCart();

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [nearbyLandmark, setNearbyLandmark] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || "");
      setContactNumber(user.contactNumber || "");
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
          <div className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-4">
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

    try {
      setSaving(true);
      await updateProfile({
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg select-none">
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
                {user.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Shield size={11} />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-1">
                {user.email}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {user.role === "admin" && (
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate("admin") : navigate("/admin"))}
                className="btn btn-secondary btn-sm gap-1.5 text-xs flex-1 sm:flex-initial"
              >
                <Shield size={13} />
                <span>Admin Studio</span>
              </button>
            )}
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

      {/* Quick Actions Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={openCart}
          className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">Shopping Cart</div>
              <div className="text-[0.7rem] text-[var(--text-muted)]">
                {totalItems} {totalItems === 1 ? "item" : "items"} currently in cart
              </div>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-white transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("products") : navigate("/products"))}
          className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] flex items-center justify-between transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">Browse Catalog</div>
              <div className="text-[0.7rem] text-[var(--text-muted)]">
                Explore fine stationery & prints
              </div>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-white transition-transform group-hover:translate-x-1" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Contact Number
              </label>
              <div className="relative flex items-center">
                <Phone size={15} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Phone number"
                  className="form-input !pl-9.5 text-xs py-2.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white transition-colors font-mono"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Date of Birth
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
          </div>

          {/* Current Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Current Address
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

          {/* Nearby Landmark */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Nearby Landmark
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
      </div>
    </div>
  );
}
