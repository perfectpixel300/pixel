import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { Toast } from "./components/common/Toast";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { InquiryModal } from "./components/storefront/InquiryModal";
import { ShopClosedModal } from "./components/storefront/ShopClosedModal";
import { Preloader } from "./components/common/Preloader";
import { api } from "./services/api";

// Helper to get initial route from URL path
const getRouteFromPath = () => {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/admin" || path === "/admin/login") return "admin";
  if (path === "/products") return "products";
  if (path === "/services") return "services";
  if (path === "/about") return "about";
  if (path === "/contact") return "contact";
  return "home";
};

function AppContent() {
  const [activePage, setActivePageState] = useState(getRouteFromPath);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [shopClosedModalOpen, setShopClosedModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme] = useState(() => localStorage.getItem("pixel_theme") || "dark");
  const [toast, setToast] = useState(null);

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [shopStatus, setShopStatus] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  // Navigation with URL history sync
  const setActivePage = (page) => {
    setActivePageState(page);
    let path = "/";
    if (page === "admin") path = "/admin";
    else if (page === "admin-login") path = "/admin";
    else if (page !== "home") path = `/${page}`;

    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActivePageState(getRouteFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("pixel_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Load backend data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        productsRes,
        categoriesRes,
        servicesRes,
        serviceCategoriesRes,
        shopStatusRes,
        bannersRes,
      ] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getServices(),
        api.getServiceCategories(),
        api.getShopStatus(),
        api.getBanners(),
      ]);

      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
      setServices(servicesRes.services || []);
      setServiceCategories(serviceCategoriesRes.categories || []);
      
      const currentShopStatus = shopStatusRes?.status || { isOpen: true };
      setShopStatus(currentShopStatus);
      setIsStatusLoading(false);
      setBanners(bannersRes.banners || []);
      setIsLiveBackend(Boolean(productsRes?.fromServer));

      // Check if store is closed and popup should be shown on initial site load
      if (
        !currentShopStatus.isOpen &&
        currentShopStatus.showPopupWhenClosed !== false
      ) {
        const isDismissed = sessionStorage.getItem("pixel_closed_modal_dismissed");
        if (!isDismissed) {
          setShopClosedModalOpen(true);
        }
      }

      // If authorized, load stats and inquiries
      if (api.checkHealth) {
        const [statsRes, inqRes] = await Promise.all([
          api.getDashboardStats(),
          api.getInquiries(),
        ]);
        setStats(statsRes);
        setInquiries(inqRes.inquiries || []);
      }
    } catch (err) {
      console.warn("Local sandbox mode fallback:", err);
      setShopStatus({ isOpen: true });
      setIsStatusLoading(false);
    } finally {
      setIsLoading(false);
      setIsStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update shop status handler from admin
  const handleUpdateShopStatus = async (statusData) => {
    try {
      const res = await api.updateShopStatus(statusData);
      setShopStatus(res.status);
      onRefreshShopStatus(res.status);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const onRefreshShopStatus = (newStatus) => {
    setShopStatus(newStatus);
    if (!newStatus.isOpen && newStatus.showPopupWhenClosed) {
      sessionStorage.removeItem("pixel_closed_modal_dismissed");
    }
  };

  // View single product detail
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open direct inquiry modal for product or service
  const handleOpenInquiry = (item) => {
    setInquiryProduct(item);
    setInquiryModalOpen(true);
  };

  // Search from navbar navigate to products page
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedCategory("All");
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdminView = activePage === "admin";

  return (
    <>
      {/* Clean Minimal Preloader */}
      <Preloader isLoading={isLoading} />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Inquiry Modal with WhatsApp redirect & NRs pricing */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => {
          setInquiryModalOpen(false);
          setInquiryProduct(null);
        }}
        product={inquiryProduct}
        onSubmitted={() => {
          showToast("Inquiry dispatched to records!");
          loadData();
        }}
      />

      {/* Shop Closed Visitor Popup Modal (Displays right after loading if shop is closed) */}
      <ShopClosedModal
        isOpen={shopClosedModalOpen}
        onClose={() => {
          setShopClosedModalOpen(false);
          sessionStorage.setItem("pixel_closed_modal_dismissed", "true");
        }}
        shopStatus={shopStatus}
      />

      {/* Storefront Layout (Public Pages) */}
      {!isAdminView ? (
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            theme={theme}
            toggleTheme={toggleTheme}
            products={products}
            onViewProduct={handleViewProduct}
            onSearchSubmit={handleSearchSubmit}
            shopStatus={shopStatus}
            isStatusLoading={isStatusLoading || !shopStatus}
            onOpenShopClosedModal={() => setShopClosedModalOpen(true)}
          />

          <main className="flex-1 min-w-0 w-full">
            {activePage === "home" && (
              <HomePage
                banners={banners}
                products={products}
                categories={categories}
                services={services}
                onViewProduct={handleViewProduct}
                onInquireProduct={handleOpenInquiry}
                onInquireService={handleOpenInquiry}
                onNavigate={setActivePage}
                onSelectCategory={setSelectedCategory}
              />
            )}

            {activePage === "products" && (
              <ProductsPage
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onViewProduct={handleViewProduct}
                onInquireProduct={handleOpenInquiry}
                searchTerm={searchQuery}
                setSearchTerm={setSearchQuery}
              />
            )}

            {activePage === "services" && (
              <ServicesPage
                services={services}
                serviceCategories={serviceCategories}
                onInquireService={handleOpenInquiry}
                onNavigate={setActivePage}
              />
            )}

            {activePage === "product-detail" && (
              <ProductDetailPage
                product={selectedProduct || products[0]}
                onBack={() => setActivePage("products")}
                onInquire={handleOpenInquiry}
              />
            )}

            {activePage === "about" && (
              <AboutPage onNavigate={setActivePage} />
            )}

            {activePage === "contact" && (
              <ContactPage />
            )}
          </main>

          <Footer setActivePage={setActivePage} categories={categories} />
        </div>
      ) : (
        /* Protected Admin Studio Layout (Accessed exclusively by visiting /admin) */
        <ProtectedRoute onBackToStore={() => setActivePage("home")}>
          <AdminDashboardPage
            stats={stats}
            products={products}
            categories={categories}
            services={services}
            serviceCategories={serviceCategories}
            shopStatus={shopStatus}
            onUpdateShopStatus={handleUpdateShopStatus}
            banners={banners}
            inquiries={inquiries}
            isLiveBackend={isLiveBackend}
            onRefreshData={loadData}
            onExitToStore={() => setActivePage("home")}
            showToast={showToast}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </ProtectedRoute>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
