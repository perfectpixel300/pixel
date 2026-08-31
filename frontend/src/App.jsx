import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { Toast } from "./components/common/Toast";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { PrintingPage } from "./pages/PrintingPage";
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
import { ScrollToTop } from "./components/common/ScrollToTop";
import { api } from "./services/api";

// Helper to get initial route from URL path
const getRouteFromPath = () => {
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/admin" || path === "/admin/login") return "admin";
  if (path === "/products") return "products";
  if (path === "/printing") return "printing";
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
  const [printingServices, setPrintingServices] = useState([]);
  const [printingCategories, setPrintingCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [shopStatus, setShopStatus] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [promoBanners, setPromoBanners] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActivePageState(getRouteFromPath());
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Guarantee scroll to top whenever activePage or selectedProduct changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activePage, selectedProduct]);

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

  // Load backend data (isInitial = true shows splash preloader on first open, false uses smooth blur refresh)
  const loadData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoad(true);
      } else {
        setIsRefreshing(true);
      }
      const [
        productsRes,
        printingServicesRes,
        printingCategoriesRes,
        categoriesRes,
        servicesRes,
        serviceCategoriesRes,
        shopStatusRes,
        bannersRes,
        promoBannersRes,
      ] = await Promise.all([
        api.getProducts(),
        api.getPrintingServices(),
        api.getPrintingCategories(),
        api.getCategories(),
        api.getServices(),
        api.getServiceCategories(),
        api.getShopStatus(),
        api.getBanners(),
        api.getPromoBanners(),
      ]);

      setProducts(productsRes.products || []);
      setPrintingServices(printingServicesRes.printingServices || []);
      setPrintingCategories(printingCategoriesRes.categories || []);
      setCategories(categoriesRes.categories || []);
      setServices(servicesRes.services || []);
      setServiceCategories(serviceCategoriesRes.categories || []);
      
      const currentShopStatus = shopStatusRes?.status || { isOpen: true, status: "open" };
      setShopStatus(currentShopStatus);
      setIsStatusLoading(false);
      setBanners(bannersRes.banners || []);
      setPromoBanners(promoBannersRes.promoBanners || []);
      setIsLiveBackend(Boolean(productsRes?.fromServer));

      // Check if popup should be shown on initial site load based on status configuration
      const curStatus =
        currentShopStatus.status || (currentShopStatus.isOpen !== false ? "open" : "closed");
      let shouldShowPopup = false;
      if (curStatus === "open") {
        shouldShowPopup = Boolean(currentShopStatus.showPopupWhenOpen);
      } else if (curStatus === "partial") {
        shouldShowPopup =
          currentShopStatus.showPopupWhenPartial !== false &&
          currentShopStatus.showPopupWhenClosed !== false;
      } else {
        shouldShowPopup = currentShopStatus.showPopupWhenClosed !== false;
      }

      if (shouldShowPopup) {
        const isDismissed = sessionStorage.getItem(`pixel_status_modal_dismissed_${curStatus}`);
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
      setIsInitialLoad(false);
      setIsRefreshing(false);
      setIsStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
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
    const curStatus = newStatus.status || (newStatus.isOpen !== false ? "open" : "closed");
    sessionStorage.removeItem(`pixel_status_modal_dismissed_${curStatus}`);
    sessionStorage.removeItem("pixel_closed_modal_dismissed");
  };

  // View single product detail
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setActivePage("product-detail");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Open direct inquiry modal for product or service
  const handleOpenInquiry = (item) => {
    setInquiryProduct(item);
    setInquiryModalOpen(true);
  };

  // Open printing inquiry modal with pre-filled specs
  const handleOpenPrintingInquiry = (service) => {
    const activePrice =
      service.discountPrice && Number(service.discountPrice) > 0 && Number(service.discountPrice) < Number(service.indicativePrice)
        ? Number(service.discountPrice)
        : Number(service.indicativePrice);

    setInquiryProduct({
      name: service.name,
      indicativePrice: activePrice,
      type: "printing",
      category: service.category || "Printing Service",
      description: service.shortDescription || service.description,
    });
    setInquiryModalOpen(true);
  };

  // Search from navbar navigate to products page
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedCategory("All");
    setActivePage("products");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const isAdminView = activePage === "admin";

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] relative selection:bg-white selection:text-black">
      {/* Clean Minimal Preloader (shown only on initial first load) */}
      <Preloader isLoading={isInitialLoad} />

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
          loadData(false);
        }}
      />

      {/* Shop Closed Visitor Popup Modal (Displays right after loading if shop is closed) */}
      <ShopClosedModal
        isOpen={shopClosedModalOpen}
        onClose={() => {
          setShopClosedModalOpen(false);
          const curStatus =
            shopStatus?.status || (shopStatus?.isOpen !== false ? "open" : "closed");
          sessionStorage.setItem(`pixel_status_modal_dismissed_${curStatus}`, "true");
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
                promoBanners={promoBanners}
                products={products}
                printingServices={printingServices}
                printingCategories={printingCategories}
                categories={categories}
                services={services}
                onViewProduct={handleViewProduct}
                onInquireProduct={handleOpenInquiry}
                onInquireService={handleOpenInquiry}
                onInquirePrinting={handleOpenPrintingInquiry}
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

            {activePage === "printing" && (
              <PrintingPage
                printingServices={printingServices}
                printingCategories={printingCategories}
                onInquirePrinting={handleOpenPrintingInquiry}
                onNavigate={setActivePage}
              />
            )}

            {activePage === "services" && (
              <ServicesPage
                services={services}
                printingServices={printingServices}
                serviceCategories={serviceCategories}
                promoBanners={promoBanners}
                onInquireService={handleOpenInquiry}
                onInquirePrinting={handleOpenInquiry}
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
            printingServices={printingServices}
            printingCategories={printingCategories}
            categories={categories}
            services={services}
            serviceCategories={serviceCategories}
            shopStatus={shopStatus}
            onUpdateShopStatus={handleUpdateShopStatus}
            banners={banners}
            promoBanners={promoBanners}
            inquiries={inquiries}
            isLiveBackend={isLiveBackend}
            onRefreshData={() => loadData(false)}
            onExitToStore={() => setActivePage("home")}
            showToast={showToast}
            theme={theme}
            toggleTheme={toggleTheme}
            isRefreshing={isRefreshing}
          />
        </ProtectedRoute>
      )}

      {/* Floating Scroll-to-Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
