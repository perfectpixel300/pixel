import { authService } from "./auth.service";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  getAuthHeaders(isJson = true) {
    const authHeaders = authService.getAuthHeader();
    if (isJson) {
      return {
        "Content-Type": "application/json",
        ...authHeaders,
      };
    }
    return authHeaders;
  }

  async checkHealth() {
    try {
      const baseUrl = API_BASE_URL.replace("/api", "");
      const res = await fetch(`${baseUrl}/`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /* ==========================================================================
     IMAGE UPLOADS (CLOUDINARY)
     ========================================================================== */

  /**
   * Upload single image to Cloudinary via backend
   * @param {File|Blob} file - Image file to upload
   * @param {string} folder - Destination folder (e.g. "products", "categories", "banners")
   * @returns {Promise<{ success: boolean, url: string, public_id: string }>}
   */
  async uploadImage(file, folder = "products") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: this.getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to upload image to Cloudinary");
    }
    return data;
  }

  /**
   * Upload multiple images to Cloudinary via backend
   * @param {FileList|File[]} files - Image files to upload
   * @param {string} folder - Destination folder
   * @returns {Promise<{ success: boolean, urls: string[], images: Array }>}
   */
  async uploadImages(files, folder = "products") {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });
    formData.append("folder", folder);

    const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: "POST",
      headers: this.getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to upload images to Cloudinary");
    }
    return data;
  }

  /**
   * Delete an image from Cloudinary by public ID
   * @param {string} publicId
   */
  async deleteImage(publicId) {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "DELETE",
      headers: this.getAuthHeaders(true),
      body: JSON.stringify({ public_id: publicId }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete image");
    }
    return data;
  }

  /* ==========================================================================
     CATEGORIES API
     ========================================================================== */

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        return { categories: data.categories || [], fromServer: true };
      }
      return { categories: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { categories: [], fromServer: false };
    }
  }

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create category");
    }
    return data;
  }

  async updateCategory(id, categoryData) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update category");
    }
    return data;
  }

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete category");
    }
    return data;
  }

  /* ==========================================================================
     PRODUCTS API
     ========================================================================== */

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        return {
          products: data.products || [],
          count: data.count || 0,
          total: data.total || 0,
          fromServer: true,
        };
      }
      return { products: [], count: 0, total: 0, fromServer: false };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], count: 0, total: 0, fromServer: false };
    }
  }

  async getProductById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch product");
    }
    return data;
  }

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create product");
    }
    return data;
  }

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update product");
    }
    return data;
  }

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete product");
    }
    return data;
  }

  async toggleProductAvailability(id) {
    if (!id) return;
    const res = await fetch(`${API_BASE_URL}/products/${id}/toggle-availability`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle availability");
    }
    return data;
  }

  async toggleProductFeatured(id) {
    if (!id) return;
    const res = await fetch(`${API_BASE_URL}/products/${id}/toggle-featured`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle featured status");
    }
    return data;
  }

  /* ==========================================================================
     BANNERS API
     ========================================================================== */

  async getBanners() {
    try {
      const res = await fetch(`${API_BASE_URL}/banners`);
      if (res.ok) {
        const data = await res.json();
        return { banners: data.banners || [], fromServer: true };
      }
      return { banners: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching banners:", error);
      return { banners: [], fromServer: false };
    }
  }

  async createBanner(bannerData) {
    const res = await fetch(`${API_BASE_URL}/banners`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bannerData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create banner");
    }
    return data;
  }

  async updateBanner(id, bannerData) {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bannerData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update banner");
    }
    return data;
  }

  async deleteBanner(id) {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete banner");
    }
    return data;
  }

  async toggleBannerActive(id) {
    const res = await fetch(`${API_BASE_URL}/banners/${id}/toggle`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle banner status");
    }
    return data;
  }

  async reorderBanners(orders) {
    const res = await fetch(`${API_BASE_URL}/banners/reorder`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ orders }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to reorder banners");
    }
    return data;
  }

  /* ==========================================================================
     SERVICES API
     ========================================================================== */

  async getServices(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/services${query ? `?${query}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        return { services: data.services || [], fromServer: true };
      }
      return { services: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching services:", error);
      return { services: [], fromServer: false };
    }
  }

  async getWebDevPackages() {
    try {
      const res = await fetch(`${API_BASE_URL}/services/web-development`);
      if (res.ok) {
        const data = await res.json();
        return { packages: data.packages || [], fromServer: true };
      }
      return { packages: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching web dev packages:", error);
      return { packages: [], fromServer: false };
    }
  }

  async createService(serviceData) {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create service");
    }
    return data;
  }

  async updateService(id, serviceData) {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update service");
    }
    return data;
  }

  async deleteService(id) {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete service");
    }
    return data;
  }

  async toggleServiceActive(id) {
    const res = await fetch(`${API_BASE_URL}/services/${id}/toggle-active`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle service status");
    }
    return data;
  }

  async toggleServiceFeatured(id) {
    const res = await fetch(`${API_BASE_URL}/services/${id}/toggle-featured`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle featured status");
    }
    return data;
  }

  /* ==========================================================================
     SERVICE CATEGORIES API
     ========================================================================== */

  async getServiceCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/service-categories`);
      if (res.ok) {
        const data = await res.json();
        return { categories: data.categories || [], fromServer: true };
      }
      return { categories: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching service categories:", error);
      return { categories: [], fromServer: false };
    }
  }

  async createServiceCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/service-categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create service category");
    }
    return data;
  }

  async updateServiceCategory(id, categoryData) {
    const res = await fetch(`${API_BASE_URL}/service-categories/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update service category");
    }
    return data;
  }

  async deleteServiceCategory(id) {
    const res = await fetch(`${API_BASE_URL}/service-categories/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete service category");
    }
    return data;
  }

  /* ==========================================================================
     PRINTING SERVICES API
     ========================================================================== */

  async getPrintingServices(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/printing-services${query ? `?${query}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        return {
          printingServices: data.printingServices || data.services || [],
          count: data.count || 0,
          total: data.total || 0,
          fromServer: true,
        };
      }
      return { printingServices: [], count: 0, total: 0, fromServer: false };
    } catch (error) {
      console.error("Error fetching printing services:", error);
      return { printingServices: [], count: 0, total: 0, fromServer: false };
    }
  }

  async getPrintingServiceById(id) {
    const res = await fetch(`${API_BASE_URL}/printing-services/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch printing service");
    }
    return data;
  }

  async createPrintingService(serviceData) {
    const res = await fetch(`${API_BASE_URL}/printing-services`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create printing service");
    }
    return data;
  }

  async updatePrintingService(id, serviceData) {
    const res = await fetch(`${API_BASE_URL}/printing-services/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update printing service");
    }
    return data;
  }

  async deletePrintingService(id) {
    const res = await fetch(`${API_BASE_URL}/printing-services/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete printing service");
    }
    return data;
  }

  async togglePrintingServiceAvailability(id) {
    if (!id) return;
    const res = await fetch(`${API_BASE_URL}/printing-services/${id}/toggle-availability`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle availability");
    }
    return data;
  }

  async togglePrintingServiceFeatured(id) {
    if (!id) return;
    const res = await fetch(`${API_BASE_URL}/printing-services/${id}/toggle-featured`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to toggle featured status");
    }
    return data;
  }

  /* ==========================================================================
     PRINTING CATEGORIES API
     ========================================================================== */

  async getPrintingCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/printing-categories`);
      if (res.ok) {
        const data = await res.json();
        return { categories: data.categories || [], fromServer: true };
      }
      return { categories: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching printing categories:", error);
      return { categories: [], fromServer: false };
    }
  }

  async createPrintingCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/printing-categories`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create printing category");
    }
    return data;
  }

  async updatePrintingCategory(id, categoryData) {
    const res = await fetch(`${API_BASE_URL}/printing-categories/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update printing category");
    }
    return data;
  }

  async deletePrintingCategory(id) {
    const res = await fetch(`${API_BASE_URL}/printing-categories/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete printing category");
    }
    return data;
  }

  /* ==========================================================================
     SHOP STATUS & NOTICES API
     ========================================================================== */

  async getShopStatus() {
    try {
      const res = await fetch(`${API_BASE_URL}/shop-status`);
      if (res.ok) {
        const data = await res.json();
        return { status: data.status || { isOpen: true }, fromServer: true };
      }
      return { status: { isOpen: true }, fromServer: false };
    } catch (error) {
      console.error("Error fetching shop status:", error);
      return { status: { isOpen: true }, fromServer: false };
    }
  }

  async updateShopStatus(statusData) {
    const res = await fetch(`${API_BASE_URL}/shop-status`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(statusData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update shop status");
    }
    return data;
  }

  /* ==========================================================================
     CONTACT & INQUIRIES API
     ========================================================================== */

  async submitContact(formData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit inquiry");
    }
    return data;
  }

  async getInquiries() {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return { inquiries: data.inquiries || [], fromServer: true };
      }
      return { inquiries: [], fromServer: false };
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      return { inquiries: [], fromServer: false };
    }
  }

  async deleteInquiry(id) {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete inquiry");
    }
    return data;
  }

  /* ==========================================================================
     DASHBOARD API
     ========================================================================== */

  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  }
}

export const api = new ApiService();
