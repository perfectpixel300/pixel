const TOKEN_KEY = "pixel_perfect_admin_token";
const USER_KEY = "pixel_perfect_admin_user";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(email, password) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPassword = (password || "").trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
        throw new Error(data.message || "Login failed");
      }

      if (!data.success || !data.token) {
        throw new Error(data.message || "Invalid login response");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (err) {
      throw new Error(err.message || "Unable to connect to server");
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