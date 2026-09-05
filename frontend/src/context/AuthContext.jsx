import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { customerAuthService } from "../services/customerAuth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Separate Administrative Studio Auth State
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // 2. Separate Storefront Customer (Normal User) Auth State
  const [customerUser, setCustomerUser] = useState(null);
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [isCustomerLoading, setIsCustomerLoading] = useState(true);

  // Initialize both sessions independently from their respective storage keys
  useEffect(() => {
    // Admin session
    const currentAdmin = authService.getCurrentUser();
    const isAdmAuth = authService.isAuthenticated();
    if (isAdmAuth && currentAdmin && (currentAdmin.role === "admin" || currentAdmin.role === "editor")) {
      setAdminUser(currentAdmin);
      setIsAdminAuthenticated(true);
    } else {
      setAdminUser(null);
      setIsAdminAuthenticated(false);
    }
    setIsAdminLoading(false);

    // Customer session
    const currentCust = customerAuthService.getCurrentUser();
    const isCustAuth = customerAuthService.isAuthenticated();
    if (isCustAuth && currentCust && currentCust.role !== "admin" && currentCust.role !== "editor") {
      setCustomerUser(currentCust);
      setIsCustomerAuthenticated(true);
      customerAuthService
        .getMe()
        .then((res) => {
          if (res?.user && res.user.role !== "admin" && res.user.role !== "editor") {
            setCustomerUser(res.user);
          }
        })
        .catch(() => {});
    } else {
      setCustomerUser(null);
      setIsCustomerAuthenticated(false);
    }
    setIsCustomerLoading(false);
  }, []);

  // --- Admin Methods (Protected Studio only) ---
  const adminLogin = async (email, password) => {
    const res = await authService.login(email, password);
    if (!res.user || (res.user.role !== "admin" && res.user.role !== "editor")) {
      throw new Error("Invalid administrative credentials.");
    }
    setAdminUser(res.user);
    setIsAdminAuthenticated(true);
    return res;
  };

  const adminLogout = () => {
    authService.logout();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  // --- Customer Methods (Storefront normal users) ---
  const customerLogin = async (email, password) => {
    const res = await customerAuthService.login(email, password);
    if (res.user && (res.user.role === "admin" || res.user.role === "editor")) {
      throw new Error("Admin accounts cannot log in as storefront customers.");
    }
    setCustomerUser(res.user);
    setIsCustomerAuthenticated(true);
    return res;
  };

  const customerRegister = async (email, password) => {
    return await customerAuthService.register(email, password);
  };

  const customerVerifyEmail = async (token) => {
    const res = await customerAuthService.verifyEmail(token);
    if (res.token && res.user) {
      setCustomerUser(res.user);
      setIsCustomerAuthenticated(true);
    }
    return res;
  };

  const customerSetupProfile = async (profileData, tempToken) => {
    const res = await customerAuthService.setupProfile(profileData, tempToken);
    if (res.user) {
      setCustomerUser(res.user);
      setIsCustomerAuthenticated(true);
    }
    return res;
  };

  const customerUpdateProfile = async (profileData) => {
    const res = await customerAuthService.updateProfile(profileData);
    if (res.user) {
      setCustomerUser(res.user);
    }
    return res;
  };

  const customerResendVerification = async (email) => {
    return await customerAuthService.resendVerification(email);
  };

  const customerLogout = () => {
    customerAuthService.logout();
    setCustomerUser(null);
    setIsCustomerAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        // Admin exports (Strictly separated for Admin Studio)
        adminUser,
        isAdminAuthenticated,
        isAdminLoading,
        adminLogin,
        adminLogout,

        // Customer exports (Strictly for normal storefront members)
        customerUser,
        isCustomerAuthenticated,
        isCustomerLoading,
        customerLogin,
        customerRegister,
        customerVerifyEmail,
        customerSetupProfile,
        customerUpdateProfile,
        customerResendVerification,
        customerLogout,

        // Storefront standard aliases for customer
        user: customerUser,
        isAuthenticated: isCustomerAuthenticated,
        isLoading: isCustomerLoading,
        login: customerLogin,
        register: customerRegister,
        verifyEmail: customerVerifyEmail,
        setupProfile: customerSetupProfile,
        updateProfile: customerUpdateProfile,
        resendVerification: customerResendVerification,
        logout: customerLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

