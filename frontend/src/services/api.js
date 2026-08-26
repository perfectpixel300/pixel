import {
  initialMockProducts,
  initialMockBanners,
  initialMockCategories,
  initialMockServices,
  initialMockServiceCategories,
  initialMockShopStatus,
} from "../data/mockData";
import { authService } from "./auth.service";


const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.localProducts = this.loadFromStorage("pixel_mock_products", initialMockProducts);
    this.localBanners = this.loadFromStorage("pixel_mock_banners", initialMockBanners);
    this.localCategories = this.loadFromStorage("pixel_mock_categories", initialMockCategories);
    this.localServices = this.loadFromStorage("pixel_mock_services", initialMockServices);
    this.localServiceCategories = this.loadFromStorage(
      "pixel_mock_service_categories",
      initialMockServiceCategories
    );
    this.localShopStatus = this.loadFromStorage("pixel_mock_shop_status", initialMockShopStatus);
    this.localInquiries = this.loadFromStorage("pixel_mock_inquiries", []);
    this.serverAvailable = null;
  }

  loadFromStorage(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage write error", e);
    }
  }

  getAuthHeaders() {
    return {
      "Content-Type": "application/json",
      ...authService.getAuthHeader(),
    };
  }

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL.replace("/api", "")}/`, {
        signal: AbortSignal.timeout(1500),
      });
      this.serverAvailable = res.ok;
      return res.ok;
    } catch {
      this.serverAvailable = false;
      return false;
    }
  }

  /* ==========================================================================
     CATEGORIES API
     ========================================================================== */

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        return { categories: data.categories, fromServer: true };
      }
    } catch {}

    // Mock fallback
    return { categories: this.localCategories, fromServer: false };
  }

  async createCategory(categoryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to create category");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newCategory = {
        _id: "cat-" + Date.now(),
        ...categoryData,
        productCount: 0,
        createdAt: new Date().toISOString(),
      };
      this.localCategories.push(newCategory);
      this.saveToStorage("pixel_mock_categories", this.localCategories);
      return { success: true, category: newCategory };
    }
  }

  async updateCategory(id, categoryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to update category");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const idx = this.localCategories.findIndex((c) => c._id === id);
      if (idx !== -1) {
        this.localCategories[idx] = { ...this.localCategories[idx], ...categoryData };
        this.saveToStorage("pixel_mock_categories", this.localCategories);
        return { success: true, category: this.localCategories[idx] };
      }
      throw new Error("Category not found");
    }
  }

  async deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to delete category");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      this.localCategories = this.localCategories.filter((c) => c._id !== id);
      this.saveToStorage("pixel_mock_categories", this.localCategories);
      return { success: true, categoryId: id };
    }
  }

  /* ==========================================================================
     PRODUCTS API
     ========================================================================== */

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      if (res.ok) {
        const data = await res.json();
        return { products: data.products, fromServer: true };
      }
    } catch {}

    // Mock fallback
    let filtered = [...this.localProducts];
    if (params.category && params.category !== "All") {
      filtered = filtered.filter((p) => p.category === params.category);
    }
    if (params.featured === "true") {
      filtered = filtered.filter((p) => p.featured);
    }
    return { products: filtered, fromServer: false };
  }

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to create product");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newProduct = {
        _id: "prod-" + Date.now(),
        ...productData,
        indicativePrice: Number(productData.indicativePrice),
        currency: "NRs.",
        createdAt: new Date().toISOString(),
      };
      this.localProducts.unshift(newProduct);
      this.saveToStorage("pixel_mock_products", this.localProducts);
      return { success: true, product: newProduct };
    }
  }

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to update product");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const idx = this.localProducts.findIndex((p) => p._id === id);
      if (idx !== -1) {
        this.localProducts[idx] = {
          ...this.localProducts[idx],
          ...productData,
          indicativePrice: Number(productData.indicativePrice),
        };
        this.saveToStorage("pixel_mock_products", this.localProducts);
        return { success: true, product: this.localProducts[idx] };
      }
      throw new Error("Product not found");
    }
  }

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || "Failed to delete product");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      this.localProducts = this.localProducts.filter((p) => p._id !== id);
      this.saveToStorage("pixel_mock_products", this.localProducts);
      return { success: true, productId: id };
    }
  }

  async toggleProductAvailability(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/availability`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const product = this.localProducts.find((p) => p._id === id);
    if (product) {
      product.isAvailable = !product.isAvailable;
      this.saveToStorage("pixel_mock_products", this.localProducts);
      return { success: true, product };
    }
  }

  async toggleProductFeatured(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/featured`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const product = this.localProducts.find((p) => p._id === id);
    if (product) {
      product.featured = !product.featured;
      this.saveToStorage("pixel_mock_products", this.localProducts);
      return { success: true, product };
    }
  }

  /* ==========================================================================
     BANNERS API
     ========================================================================== */

  async getBanners() {
    try {
      const res = await fetch(`${API_BASE_URL}/banners`);
      if (res.ok) {
        const data = await res.json();
        return { banners: data.banners, fromServer: true };
      }
    } catch {}

    return { banners: this.localBanners, fromServer: false };
  }

  async createBanner(bannerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/banners`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bannerData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to create banner");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newBanner = {
        _id: "banner-" + Date.now(),
        ...bannerData,
        order: Number(bannerData.order || this.localBanners.length + 1),
        createdAt: new Date().toISOString(),
      };
      this.localBanners.push(newBanner);
      this.saveToStorage("pixel_mock_banners", this.localBanners);
      return { success: true, banner: newBanner };
    }
  }

  async updateBanner(id, bannerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(bannerData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to update banner");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const idx = this.localBanners.findIndex((b) => b._id === id);
      if (idx !== -1) {
        this.localBanners[idx] = { ...this.localBanners[idx], ...bannerData };
        this.saveToStorage("pixel_mock_banners", this.localBanners);
        return { success: true, banner: this.localBanners[idx] };
      }
      throw new Error("Banner not found");
    }
  }

  async deleteBanner(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      this.localBanners = this.localBanners.filter((b) => b._id !== id);
      this.saveToStorage("pixel_mock_banners", this.localBanners);
      return { success: true, bannerId: id };
    }
  }

  async toggleBannerActive(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/banners/${id}/toggle`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const banner = this.localBanners.find((b) => b._id === id);
    if (banner) {
      banner.isActive = !banner.isActive;
      this.saveToStorage("pixel_mock_banners", this.localBanners);
      return { success: true, banner };
    }
  }

  async reorderBanners(orders) {
    try {
      const res = await fetch(`${API_BASE_URL}/banners/reorder`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ orders }),
      });
      if (res.ok) return await res.json();
    } catch {}

    orders.forEach(({ id, order }) => {
      const b = this.localBanners.find((item) => item._id === id);
      if (b) b.order = order;
    });
    this.saveToStorage("pixel_mock_banners", this.localBanners);
    return { success: true };
  }

  /* ==========================================================================
     SERVICES API
     ========================================================================== */

  async getServices(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/services?${query}`);
      if (res.ok) {
        const data = await res.json();
        return { services: data.services, fromServer: true };
      }
    } catch {}

    // Mock fallback
    let filtered = [...this.localServices];
    if (params.category && params.category !== "All") {
      filtered = filtered.filter((s) => s.category === params.category);
    }
    if (params.isWebDevPackage !== undefined) {
      const boolVal = params.isWebDevPackage === "true" || params.isWebDevPackage === true;
      filtered = filtered.filter((s) => Boolean(s.isWebDevPackage) === boolVal);
    }
    if (params.isFeatured === "true") {
      filtered = filtered.filter((s) => s.isFeatured);
    }
    if (params.isActive === "true") {
      filtered = filtered.filter((s) => s.isActive);
    }
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.shortDescription?.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return { services: filtered, fromServer: false };
  }

  async getWebDevPackages() {
    try {
      const res = await fetch(`${API_BASE_URL}/services/web-development`);
      if (res.ok) {
        const data = await res.json();
        return { packages: data.packages, fromServer: true };
      }
    } catch {}

    const pkgs = this.localServices
      .filter((s) => s.isWebDevPackage)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.price - b.price);

    return { packages: pkgs, fromServer: false };
  }

  async createService(serviceData) {
    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to create service");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newService = {
        _id: "serv-" + Date.now(),
        ...serviceData,
        price: Number(serviceData.price),
        currency: "NRs.",
        displayOrder: Number(serviceData.displayOrder || this.localServices.length + 1),
        createdAt: new Date().toISOString(),
      };
      this.localServices.push(newService);
      this.saveToStorage("pixel_mock_services", this.localServices);
      return { success: true, service: newService };
    }
  }

  async updateService(id, serviceData) {
    if (!id || id === "undefined" || id === "null") {
      return this.createService(serviceData);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to update service");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const idx = this.localServices.findIndex((s) => s._id === id);
      if (idx !== -1) {
        this.localServices[idx] = {
          ...this.localServices[idx],
          ...serviceData,
          price: Number(serviceData.price !== undefined ? serviceData.price : this.localServices[idx].price),
        };
        this.saveToStorage("pixel_mock_services", this.localServices);
        return { success: true, service: this.localServices[idx] };
      }
      throw new Error("Service not found");
    }
  }

  async deleteService(id) {
    if (!id || id === "undefined" || id === "null") {
      return { success: true };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to delete service");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      this.localServices = this.localServices.filter((s) => s._id !== id);
      this.saveToStorage("pixel_mock_services", this.localServices);
      return { success: true, serviceId: id };
    }
  }

  async toggleServiceActive(id) {
    if (!id || id === "undefined" || id === "null") return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}/toggle-active`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const service = this.localServices.find((s) => s._id === id);
    if (service) {
      service.isActive = !service.isActive;
      this.saveToStorage("pixel_mock_services", this.localServices);
      return { success: true, service };
    }
  }

  async toggleServiceFeatured(id) {
    if (!id || id === "undefined" || id === "null") return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}/toggle-featured`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const service = this.localServices.find((s) => s._id === id);
    if (service) {
      service.isFeatured = !service.isFeatured;
      this.saveToStorage("pixel_mock_services", this.localServices);
      return { success: true, service };
    }
  }

  /* ==========================================================================
     CONTACT & INQUIRIES API
     ========================================================================== */

  async submitContact(formData) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to submit inquiry");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newInquiry = {
        _id: "inq-" + Date.now(),
        ...formData,
        status: "unread",
        createdAt: new Date().toISOString(),
      };
      this.localInquiries.unshift(newInquiry);
      this.saveToStorage("pixel_mock_inquiries", this.localInquiries);
      return { success: true, inquiry: newInquiry };
    }
  }

  async getInquiries() {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { inquiries: data.inquiries, fromServer: true };
      }
    } catch {}

    return { inquiries: this.localInquiries, fromServer: false };
  }

  async deleteInquiry(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    this.localInquiries = this.localInquiries.filter((i) => i._id !== id);
    this.saveToStorage("pixel_mock_inquiries", this.localInquiries);
    return { success: true };
  }

  /* ==========================================================================
     SERVICE CATEGORIES API
     ========================================================================== */

  async getServiceCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/service-categories`);
      if (res.ok) {
        const data = await res.json();
        return { categories: data.categories, fromServer: true };
      }
    } catch {}

    // Mock fallback with dynamic counts
    const countMap = {};
    this.localServices.forEach((s) => {
      if (s.category) {
        countMap[s.category] = (countMap[s.category] || 0) + 1;
      }
    });

    const catsWithCount = this.localServiceCategories.map((c) => ({
      ...c,
      serviceCount: countMap[c.name] || 0,
    }));

    return { categories: catsWithCount, fromServer: false };
  }

  async createServiceCategory(categoryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/service-categories`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to create service category");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const newCategory = {
        _id: "scat-" + Date.now(),
        ...categoryData,
        displayOrder: Number(categoryData.displayOrder || this.localServiceCategories.length + 1),
        serviceCount: 0,
        createdAt: new Date().toISOString(),
      };
      this.localServiceCategories.push(newCategory);
      this.saveToStorage("pixel_mock_service_categories", this.localServiceCategories);
      return { success: true, category: newCategory };
    }
  }

  async updateServiceCategory(id, categoryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/service-categories/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to update service category");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const idx = this.localServiceCategories.findIndex((c) => c._id === id);
      if (idx !== -1) {
        const oldName = this.localServiceCategories[idx].name;
        this.localServiceCategories[idx] = {
          ...this.localServiceCategories[idx],
          ...categoryData,
          displayOrder: Number(categoryData.displayOrder || this.localServiceCategories[idx].displayOrder),
        };
        // Cascade rename to local services if name changed
        if (categoryData.name && categoryData.name !== oldName) {
          this.localServices.forEach((s) => {
            if (s.category === oldName) s.category = categoryData.name;
          });
          this.saveToStorage("pixel_mock_services", this.localServices);
        }
        this.saveToStorage("pixel_mock_service_categories", this.localServiceCategories);
        return { success: true, category: this.localServiceCategories[idx] };
      }
      throw new Error("Service category not found");
    }
  }

  async deleteServiceCategory(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/service-categories/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      const target = this.localServiceCategories.find((c) => c._id === id);
      if (target) {
        // Move local services in this category to General IT
        this.localServices.forEach((s) => {
          if (s.category === target.name) s.category = "General IT";
        });
        this.saveToStorage("pixel_mock_services", this.localServices);
      }
      this.localServiceCategories = this.localServiceCategories.filter((c) => c._id !== id);
      this.saveToStorage("pixel_mock_service_categories", this.localServiceCategories);
      return { success: true, categoryId: id };
    }
  }

  /* ==========================================================================
     SHOP STATUS & TIMER API
     ========================================================================== */

  async getShopStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/shop-status`);
      if (res.ok) {
        const data = await res.json();
        return { status: data.status, fromServer: true };
      }
    } catch {}

    return { status: this.localShopStatus, fromServer: false };
  }

  async updateShopStatus(statusData) {
    try {
      const res = await fetch(`${API_BASE_URL}/shop-status`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(statusData),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.message || "Failed to update shop status");
    } catch (e) {
      if (e.message && !e.message.includes("Failed to fetch")) throw e;
      this.localShopStatus = {
        ...this.localShopStatus,
        ...statusData,
        updatedAt: new Date().toISOString(),
      };
      this.saveToStorage("pixel_mock_shop_status", this.localShopStatus);
      return { success: true, status: this.localShopStatus };
    }
  }

  /* ==========================================================================
     DASHBOARD & SEED API
     ========================================================================== */

  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) return await res.json();
    } catch {}

    const totalVal = this.localProducts.reduce(
      (acc, p) => acc + (p.indicativePrice || 0) * (p.stock || 1),
      0
    );

    return {
      products: {
        total: this.localProducts.length,
        available: this.localProducts.filter((p) => p.isAvailable).length,
        totalValue: totalVal,
      },
      banners: {
        total: this.localBanners.length,
        active: this.localBanners.filter((b) => b.isActive).length,
      },
      services: {
        total: this.localServices.length,
        active: this.localServices.filter((s) => s.isActive).length,
        featured: this.localServices.filter((s) => s.isFeatured).length,
      },
      inquiries: {
        total: this.localInquiries.length,
        unread: this.localInquiries.filter((i) => i.status === "unread").length,
      },
    };
  }

  async seedDatabase(overwrite = false) {
    try {
      const res = await fetch(`${API_BASE_URL}/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overwrite }),
      });
      if (res.ok) return await res.json();
    } catch {}

    this.localProducts = [...initialMockProducts];
    this.localBanners = [...initialMockBanners];
    this.localCategories = [...initialMockCategories];
    this.localServices = [...initialMockServices];
    this.localServiceCategories = [...initialMockServiceCategories];
    this.localShopStatus = { ...initialMockShopStatus };
    this.saveToStorage("pixel_mock_products", this.localProducts);
    this.saveToStorage("pixel_mock_banners", this.localBanners);
    this.saveToStorage("pixel_mock_categories", this.localCategories);
    this.saveToStorage("pixel_mock_services", this.localServices);
    this.saveToStorage("pixel_mock_service_categories", this.localServiceCategories);
    this.saveToStorage("pixel_mock_shop_status", this.localShopStatus);
    return { success: true, message: "Sample data seeded with IT Services, Categories, and Shop Status in NRs. currency!" };
  }
}

export const api = new ApiService();


