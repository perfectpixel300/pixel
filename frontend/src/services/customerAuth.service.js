const TOKEN_KEY = "pixel_customer_token";
const USER_KEY = "pixel_customer_user";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const customerAuthService = {
  async register(email, password) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPassword = (password || "").trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async resendVerification(email) {
    const cleanEmail = (email || "").toLowerCase().trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async verifyEmail(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async setupProfile(profileData, tempToken) {
    try {
      const token = tempToken || this.getToken();
      const res = await fetch(`${API_BASE_URL}/auth/customer/setup-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to complete account setup");
      }

      if (data.token && data.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async login(email, password) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPassword = (password || "").trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error = new Error(data.message || "Login failed");
        error.unverified = Boolean(data.unverified);
        error.incompleteProfile = Boolean(data.incompleteProfile);
        error.setupToken = data.setupToken;
        error.email = data.email || cleanEmail;
        throw error;
      }

      if (!data.success || !data.token) {
        throw new Error(data.message || "Invalid login response");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (err) {
      throw err;
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/me`, {
        headers: {
          ...this.getAuthHeader(),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to get profile");
      }

      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },
};
