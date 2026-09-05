import React from "react";
import { useAuth } from "../context/AuthContext";
import { AdminLoginPage } from "../pages/AdminLoginPage";

export function ProtectedRoute({ children, onBackToStore }) {
  const { isAdminAuthenticated, isAdminLoading } = useAuth();

  if (isAdminLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[var(--text-muted)] text-sm">
        Verifying administrative authorization...
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLoginPage onBackToStore={onBackToStore} />;
  }

  return children;
}
