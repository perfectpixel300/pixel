const TOKEN_KEY = "pixel_perfect_admin_token";
const USER_KEY = "pixel_perfect_admin_user";

export const authService = {
  // Login admin (handles live backend API or sandbox offline fallback)
  async login(email, password) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPassword = (password || "").trim();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          return data;
        }
      }

      // If server returned non-ok or unhandled error
      const errData = await res.json().catch(() => ({}));
      if (errData.message) {
        throw new Error(errData.message);
      }
    } catch (err) {
      // Local fallback for offline mode or network error
      if (cleanEmail === "admin@pixelperfect.com" && cleanPassword === "admin123") {
        const mockUser = {
          id: "admin-local",
          name: "Pixel Perfect Admin",
          email: "admin@pixelperfect.com",
          role: "admin",
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        return { success: true, token: mockToken, user: mockUser };
      }

      if (err.message && err.message !== "Failed to fetch") {
        throw err;
      }
    }

    // Default fallback check
    if (cleanEmail === "admin@pixelperfect.com" && cleanPassword === "admin123") {
      const mockUser = {
        id: "admin-local",
        name: "Pixel Perfect Admin",
        email: "admin@pixelperfect.com",
        role: "admin",
      };
      const mockToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return { success: true, token: mockToken, user: mockUser };
    }

    throw new Error("Invalid admin credentials. Use admin@pixelperfect.com / admin123");
  },

  // Logout admin
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get current token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get authorization header object for API calls
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated() {
    return Boolean(this.getToken());
  },
};
