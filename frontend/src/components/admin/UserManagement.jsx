import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Clock,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import { api } from "../../services/api";

export function UserManagement({ showToast }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'deletionRequested' | 'active'

  // Verification modal state to prevent accidental deletion
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    user: null,
    typedConfirmation: "",
    isDeleting: false,
    error: null,
  });

  const fetchUsers = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setIsLoading(true);
      else setIsRefreshing(true);

      const res = await api.getCustomers();
      if (res && res.customers) {
        setUsers(res.customers);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      if (showToast) {
        showToast(err.message || "Failed to load registered users", "error");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const handleOpenDeleteModal = (user) => {
    setConfirmModal({
      isOpen: true,
      user,
      typedConfirmation: "",
      isDeleting: false,
      error: null,
    });
  };

  const handleCloseDeleteModal = () => {
    setConfirmModal({
      isOpen: false,
      user: null,
      typedConfirmation: "",
      isDeleting: false,
      error: null,
    });
  };

  const handleConfirmApproveDelete = async (e) => {
    e.preventDefault();
    if (!confirmModal.user) return;

    // Safety verification check: Admin must type "DELETE" to prevent accidental clicks
    if (confirmModal.typedConfirmation.trim().toUpperCase() !== "DELETE") {
      setConfirmModal((prev) => ({
        ...prev,
        error: 'Please type "DELETE" exactly to confirm this irreversible action.',
      }));
      return;
    }

    try {
      setConfirmModal((prev) => ({ ...prev, isDeleting: true, error: null }));
      await api.approveDeleteCustomer(confirmModal.user._id);

      if (showToast) {
        showToast(
          `Account for ${confirmModal.user.email} was permanently deleted and notification email sent.`
        );
      }

      handleCloseDeleteModal();
      fetchUsers(false);
    } catch (err) {
      console.error("Approve delete error:", err);
      setConfirmModal((prev) => ({
        ...prev,
        isDeleting: false,
        error: err.message || "Failed to permanently delete customer account.",
      }));
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (statusFilter === "deletionRequested" && !u.deletionRequested) {
      return false;
    }
    if (statusFilter === "active" && (!u.isEmailVerified || u.deletionRequested)) {
      return false;
    }
    if (statusFilter === "unverified" && u.isEmailVerified) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const name = (u.fullName || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const contact = `${u.countryCode || ""} ${u.contactNumber || ""}`.toLowerCase();
      const address = (u.currentAddress || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        contact.includes(q) ||
        address.includes(q)
      );
    }

    return true;
  });

  const totalUsers = users.length;
  const pendingDeletions = users.filter((u) => u.deletionRequested).length;
  const activeVerified = users.filter((u) => u.isEmailVerified && !u.deletionRequested).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Users</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Registered customer accounts, contact details, and account deletion requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(false)}
          disabled={isRefreshing || isLoading}
          className="btn btn-secondary btn-sm gap-1.5 text-xs !h-9 border border-[var(--border-subtle)]"
          title="Refresh customer list"
        >
          <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[0.675rem] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              Total Users
            </div>
            <div className="text-2xl font-black font-mono mt-0.5">{totalUsers}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Users size={18} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[0.675rem] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              Active & Verified
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
              {activeVerified}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck size={18} />
          </div>
        </div>

        <div
          className={`bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between shadow-xs border transition-colors ${
            pendingDeletions > 0
              ? "border-rose-500/40 bg-rose-500/5"
              : "border-[var(--border-subtle)]"
          }`}
        >
          <div>
            <div
              className={`text-[0.675rem] uppercase font-bold tracking-wider ${
                pendingDeletions > 0 ? "text-rose-400" : "text-[var(--text-muted)]"
              }`}
            >
              Deletion Requests
            </div>
            <div
              className={`text-2xl font-black font-mono mt-0.5 ${
                pendingDeletions > 0 ? "text-rose-400" : "text-zinc-300"
              }`}
            >
              {pendingDeletions}
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center ${
              pendingDeletions > 0
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                : "bg-[var(--bg-app)] border-[var(--border-subtle)] text-zinc-500"
            }`}
          >
            <ShieldAlert size={18} />
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter Pills */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search users by name, email, contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input text-xs !pl-9 py-1.5 w-full bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[0.7rem] text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Filter size={12} />
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-2.5 py-1 text-xs rounded-full border font-medium transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-black border-white font-bold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
            }`}
          >
            All ({totalUsers})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("deletionRequested")}
            className={`px-2.5 py-1 text-xs rounded-full border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              statusFilter === "deletionRequested"
                ? "bg-rose-600 text-white border-rose-500 font-bold"
                : pendingDeletions > 0
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
            }`}
          >
            <span>Deletion Requests</span>
            {pendingDeletions > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[0.62rem] font-black flex items-center justify-center">
                {pendingDeletions}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-2.5 py-1 text-xs rounded-full border font-medium transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-white text-black border-white font-bold"
                : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
            }`}
          >
            Active ({activeVerified})
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[var(--text-muted)] gap-3">
            <Loader2 size={24} className="animate-spin text-[var(--text-primary)]" />
            <span className="text-xs">Loading registered users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <Users size={32} className="mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm font-semibold m-0 text-[var(--text-primary)]">No users found</p>
            <p className="text-xs mt-1 text-[var(--text-muted)]">
              {search
                ? `No customers match your search "${search}"`
                : statusFilter === "deletionRequested"
                ? "There are no pending account deletion requests."
                : "No registered customers in directory yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/50 text-[var(--text-muted)] text-[0.68rem] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Primary Contact</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredUsers.map((customer) => {
                  const initial = (customer.fullName || customer.email || "U")[0].toUpperCase();
                  const isDeletionPending = Boolean(customer.deletionRequested);
                  const fullPrimaryContact = customer.contactNumber
                    ? `${customer.countryCode || "+977"} ${customer.contactNumber}`
                    : "Not specified";

                  return (
                    <tr
                      key={customer._id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isDeletionPending ? "bg-rose-500/[0.04]" : ""
                      }`}
                    >
                      {/* Name with avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                              isDeletionPending
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[var(--text-primary)] truncate">
                              {customer.fullName || "Member"}
                            </div>
                            {customer.currentAddress && (
                              <div className="text-[0.68rem] text-[var(--text-muted)] truncate max-w-[180px]">
                                {customer.currentAddress}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[var(--text-primary)]">
                          <Mail size={13} className="text-[var(--text-muted)] shrink-0" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                      </td>

                      {/* Primary Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[var(--text-primary)]">
                          <Phone size={13} className="text-[var(--text-muted)] shrink-0" />
                          <span>{fullPrimaryContact}</span>
                        </div>
                        {customer.secondaryContactNumber && (
                          <div className="text-[0.675rem] text-[var(--text-muted)] font-mono pl-4 mt-0.5">
                            Alt: {customer.secondaryCountryCode || "+977"}{" "}
                            {customer.secondaryContactNumber}
                          </div>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono text-[0.7rem] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="shrink-0" />
                          <span>{formatDate(customer.createdAt)}</span>
                        </div>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isDeletionPending ? (
                          <div className="inline-flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                              <ShieldAlert size={11} />
                              <span>Deletion Requested</span>
                            </span>
                            {customer.deletionRequestedAt && (
                              <span className="text-[0.62rem] text-rose-300/70 pl-1">
                                {formatTimeAgo(customer.deletionRequestedAt)}
                              </span>
                            )}
                          </div>
                        ) : customer.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                            <CheckCircle size={11} />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[0.68rem] font-medium px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
                            <Clock size={11} />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isDeletionPending ? (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(customer)}
                            className="btn btn-danger btn-sm text-xs gap-1.5 !py-1.5 !px-3 font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer"
                            title="Approve deletion request and permanently delete account"
                          >
                            <Trash2 size={12} />
                            <span>Approve Deletion</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(customer)}
                            className="btn btn-ghost btn-sm text-xs text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded transition-colors cursor-pointer"
                            title="Delete customer account"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permanent Deletion Verification Modal (Prevents Accidental Deletion) */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={confirmModal.isDeleting}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-white m-0">
              {confirmModal.user.deletionRequested
                ? "Approve & Permanently Delete User"
                : "Permanently Delete Customer Account"}
            </h3>

            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              This action is <strong className="text-rose-400">permanent and irreversible</strong>.
              The customer account will be completely removed from the database, and an email notification
              confirming deletion will be automatically sent to the customer.
            </p>

            {/* User Details Summary Card */}
            <div className="my-4 p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Name:</span>
                <span className="text-zinc-200 font-medium">
                  {confirmModal.user.fullName || "Valued Member"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email:</span>
                <span className="text-zinc-200 font-mono">{confirmModal.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Primary Contact:</span>
                <span className="text-zinc-200 font-mono">
                  {confirmModal.user.contactNumber
                    ? `${confirmModal.user.countryCode || "+977"} ${confirmModal.user.contactNumber}`
                    : "None"}
                </span>
              </div>
              {confirmModal.user.deletionRequested && (
                <div className="flex justify-between text-rose-400 pt-1 border-t border-zinc-800/80">
                  <span>Requested At:</span>
                  <span>{formatDate(confirmModal.user.deletionRequestedAt)}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleConfirmApproveDelete}>
              {confirmModal.error && (
                <div className="mb-3.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {confirmModal.error}
                </div>
              )}

              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                To prevent accidental deletion, type{" "}
                <span className="text-rose-400 font-mono font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                required
                value={confirmModal.typedConfirmation}
                onChange={(e) =>
                  setConfirmModal((prev) => ({
                    ...prev,
                    typedConfirmation: e.target.value,
                    error: null,
                  }))
                }
                placeholder="Type DELETE"
                className="form-input text-xs py-2 px-3 w-full bg-zinc-950 rounded-lg border border-zinc-700 focus:border-rose-400 text-white font-mono uppercase transition-colors mb-5"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={confirmModal.isDeleting}
                  onClick={handleCloseDeleteModal}
                  className="btn btn-ghost btn-sm text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    confirmModal.isDeleting ||
                    confirmModal.typedConfirmation.trim().toUpperCase() !== "DELETE"
                  }
                  className="btn btn-danger btn-sm text-xs gap-2 py-2 px-4 font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer"
                >
                  {confirmModal.isDeleting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Deleting & Emailing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span>Confirm & Permanently Delete</span>
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
