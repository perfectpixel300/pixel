import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { DashboardOverview } from "../components/admin/DashboardOverview";
import { ProductManagement } from "../components/admin/ProductManagement";
import { PrintingManagement } from "../components/admin/PrintingManagement";
import { PrintingCategoryManagement } from "../components/admin/PrintingCategoryManagement";
import { CategoryManagement } from "../components/admin/CategoryManagement";
import { WebTiersManagement } from "../components/admin/WebTiersManagement";
import { ServicesManagement } from "../components/admin/ServicesManagement";
import { ServiceCategoryManagement } from "../components/admin/ServiceCategoryManagement";
import { ShopStatusManagement } from "../components/admin/ShopStatusManagement";
import { BannerManagement } from "../components/admin/BannerManagement";
import { PromoManagement } from "../components/admin/PromoManagement";
import { InquiriesManagement } from "../components/admin/InquiriesManagement";
import { AboutManagement } from "../components/admin/AboutManagement";
import { BlogManagement } from "../components/admin/BlogManagement";
import { ProductFormModal } from "../components/admin/ProductFormModal";
import { PrintingFormModal } from "../components/admin/PrintingFormModal";
import { PrintingCategoryFormModal } from "../components/admin/PrintingCategoryFormModal";
import { CategoryFormModal } from "../components/admin/CategoryFormModal";
import { ServiceCategoryFormModal } from "../components/admin/ServiceCategoryFormModal";
import { ServiceFormModal } from "../components/admin/ServiceFormModal";
import { BannerFormModal } from "../components/admin/BannerFormModal";
import { PromoFormModal } from "../components/admin/PromoFormModal";
import { BlogFormModal } from "../components/admin/BlogFormModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { api } from "../services/api";

export function AdminDashboardPage({
  stats = null,
  products = [],
  printingServices = [],
  printingCategories = [],
  categories = [],
  services = [],
  serviceCategories = [],
  shopStatus = { isOpen: true },
  onUpdateShopStatus,
  banners = [],
  promoBanners = [],
  blogs = [],
  inquiries = [],
  aboutData = null,
  onUpdateAbout,
  onNavigateToBlogLive,
  isLiveBackend = false,
  onRefreshData,
  onExitToStore,
  showToast,
  theme,
  toggleTheme,
  isRefreshing = false,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'shop-status' | 'printing' | 'printing-categories' | 'web-tiers' | 'services' | 'service-categories' | 'products' | 'categories' | 'banners' | 'inquiries'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [productModal, setProductModal] = useState({ isOpen: false, product: null });
  const [printingModal, setPrintingModal] = useState({ isOpen: false, service: null });
  const [printingCategoryModal, setPrintingCategoryModal] = useState({ isOpen: false, category: null });
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, category: null });
  const [serviceCategoryModal, setServiceCategoryModal] = useState({ isOpen: false, category: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, service: null });
  const [bannerModal, setBannerModal] = useState({ isOpen: false, banner: null });
  const [promoModal, setPromoModal] = useState({ isOpen: false, promo: null });
  const [blogModal, setBlogModal] = useState({ isOpen: false, blog: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: "product", id: null, name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const webTiersCount = (services || []).filter((s) => s && s.isWebDevPackage).length;
  const itServicesCount = (services || []).filter((s) => s && !s.isWebDevPackage).length;

  // Product CRUD
  const handleOpenCreateProduct = () => setProductModal({ isOpen: true, product: null });
  const handleOpenEditProduct = (product) => setProductModal({ isOpen: true, product });

  const handleSubmitProduct = async (productData) => {
    try {
      setIsSubmitting(true);
      const targetId = productModal.product?._id || productData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateProduct(targetId, productData);
        showToast(`Product "${productData.name}" updated!`);
      } else {
        await api.createProduct(productData);
        showToast(`Product "${productData.name}" created!`);
      }
      setProductModal({ isOpen: false, product: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductPrompt = (product) => {
    setDeleteModal({
      isOpen: true,
      type: "product",
      id: product._id,
      name: product.name,
    });
  };

  const handleToggleProductAvailability = async (productId) => {
    if (!productId || productId === "undefined") return;
    try {
      await api.toggleProductAvailability(productId);
      showToast("Availability status updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle availability", "error");
    }
  };

  const handleToggleProductFeatured = async (productId) => {
    if (!productId || productId === "undefined") return;
    try {
      await api.toggleProductFeatured(productId);
      showToast("Featured status updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle featured status", "error");
    }
  };

  // Printing Services CRUD
  const handleOpenCreatePrintingService = () => setPrintingModal({ isOpen: true, service: null });
  const handleOpenEditPrintingService = (service) => setPrintingModal({ isOpen: true, service });

  const handleSubmitPrintingService = async (serviceData) => {
    try {
      setIsSubmitting(true);
      const targetId = printingModal.service?._id || serviceData._id;
      if (targetId && targetId !== "undefined") {
        await api.updatePrintingService(targetId, serviceData);
        showToast(`Printing Service "${serviceData.name}" updated!`);
      } else {
        await api.createPrintingService(serviceData);
        showToast(`Printing Service "${serviceData.name}" created!`);
      }
      setPrintingModal({ isOpen: false, service: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save printing service", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePrintingServicePrompt = (service) => {
    setDeleteModal({
      isOpen: true,
      type: "printing-service",
      id: service._id,
      name: service.name,
    });
  };

  const handleTogglePrintingServiceAvailability = async (serviceId) => {
    if (!serviceId || serviceId === "undefined") return;
    try {
      await api.togglePrintingServiceAvailability(serviceId);
      showToast("Printing service availability updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle availability", "error");
    }
  };

  const handleTogglePrintingServiceFeatured = async (serviceId) => {
    if (!serviceId || serviceId === "undefined") return;
    try {
      await api.togglePrintingServiceFeatured(serviceId);
      showToast("Printing service featured flag updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle featured status", "error");
    }
  };

  // Printing Category CRUD
  const handleOpenCreatePrintingCategory = () =>
    setPrintingCategoryModal({ isOpen: true, category: null });
  const handleOpenEditPrintingCategory = (category) =>
    setPrintingCategoryModal({ isOpen: true, category });

  const handleSubmitPrintingCategory = async (categoryData) => {
    try {
      setIsSubmitting(true);
      const targetId = printingCategoryModal.category?._id || categoryData._id;
      if (targetId && targetId !== "undefined") {
        await api.updatePrintingCategory(targetId, categoryData);
        showToast(`Printing Category "${categoryData.name}" updated!`);
      } else {
        await api.createPrintingCategory(categoryData);
        showToast(`Printing Category "${categoryData.name}" created!`);
      }
      setPrintingCategoryModal({ isOpen: false, category: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save printing category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePrintingCategoryPrompt = (category) => {
    setDeleteModal({
      isOpen: true,
      type: "printing-category",
      id: category._id,
      name: category.name,
    });
  };

  // Service & Web Tier CRUD
  const handleOpenCreateService = (initial = null) => {
    setServiceModal({
      isOpen: true,
      service: initial
        ? {
            title: "",
            category: initial.category || (initial.isWebDevPackage ? "Web Development" : "Mobile Development"),
            isWebDevPackage: Boolean(initial.isWebDevPackage),
            packageTier: initial.isWebDevPackage ? "starter" : "none",
            price: initial.isWebDevPackage ? 25000 : 30000,
            features: [""],
            technologies: [],
            isActive: true,
          }
        : null,
    });
  };

  const handleOpenEditService = (service) => setServiceModal({ isOpen: true, service });

  const handleSubmitService = async (serviceData) => {
    try {
      setIsSubmitting(true);
      const targetId = serviceModal.service?._id || serviceData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateService(targetId, serviceData);
        showToast(`Service "${serviceData.title}" updated!`);
      } else {
        await api.createService(serviceData);
        showToast(`Service "${serviceData.title}" created!`);
      }
      setServiceModal({ isOpen: false, service: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save service", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteServicePrompt = (service) => {
    setDeleteModal({
      isOpen: true,
      type: "service",
      id: service._id,
      name: service.title,
    });
  };

  const handleToggleServiceActive = async (serviceId) => {
    if (!serviceId || serviceId === "undefined") return;
    try {
      await api.toggleServiceActive(serviceId);
      showToast("Service visibility status updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle service status", "error");
    }
  };

  const handleToggleServiceFeatured = async (serviceId) => {
    if (!serviceId || serviceId === "undefined") return;
    try {
      await api.toggleServiceFeatured(serviceId);
      showToast("Service featured flag updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle service featured status", "error");
    }
  };

  // Category CRUD
  const handleOpenCreateCategory = () => setCategoryModal({ isOpen: true, category: null });
  const handleOpenEditCategory = (category) => setCategoryModal({ isOpen: true, category });

  const handleSubmitCategory = async (categoryData) => {
    try {
      setIsSubmitting(true);
      const targetId = categoryModal.category?._id || categoryData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateCategory(targetId, categoryData);
        showToast(`Category "${categoryData.name}" updated!`);
      } else {
        await api.createCategory(categoryData);
        showToast(`Category "${categoryData.name}" created!`);
      }
      setCategoryModal({ isOpen: false, category: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategoryPrompt = (category) => {
    setDeleteModal({
      isOpen: true,
      type: "category",
      id: category._id,
      name: category.name,
    });
  };

  // Service Category CRUD
  const handleOpenCreateServiceCategory = () =>
    setServiceCategoryModal({ isOpen: true, category: null });
  const handleOpenEditServiceCategory = (category) =>
    setServiceCategoryModal({ isOpen: true, category });

  const handleSubmitServiceCategory = async (categoryData) => {
    try {
      setIsSubmitting(true);
      const targetId = serviceCategoryModal.category?._id || categoryData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateServiceCategory(targetId, categoryData);
        showToast(`Service Category "${categoryData.name}" updated!`);
      } else {
        await api.createServiceCategory(categoryData);
        showToast(`Service Category "${categoryData.name}" created!`);
      }
      setServiceCategoryModal({ isOpen: false, category: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save service category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteServiceCategoryPrompt = (category) => {
    setDeleteModal({
      isOpen: true,
      type: "service-category",
      id: category._id,
      name: category.name,
    });
  };

  // Banner CRUD
  const handleOpenCreateBanner = () => setBannerModal({ isOpen: true, banner: null });
  const handleOpenEditBanner = (banner) => setBannerModal({ isOpen: true, banner });

  const handleSubmitBanner = async (bannerData) => {
    try {
      setIsSubmitting(true);
      const targetId = bannerModal.banner?._id || bannerData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateBanner(targetId, bannerData);
        showToast(`Banner "${bannerData.title}" updated!`);
      } else {
        await api.createBanner(bannerData);
        showToast(`Banner "${bannerData.title}" created!`);
      }
      setBannerModal({ isOpen: false, banner: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save banner", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBannerPrompt = (banner) => {
    setDeleteModal({
      isOpen: true,
      type: "banner",
      id: banner._id,
      name: banner.title,
    });
  };

  const handleToggleBannerActive = async (bannerId) => {
    try {
      await api.toggleBannerActive(bannerId);
      showToast("Banner visibility updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle banner status", "error");
    }
  };

  const handleReorderBanners = async (orderList) => {
    try {
      await api.reorderBanners(orderList);
      showToast("Banner rotation reordered!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to reorder banners", "error");
    }
  };

  // Promo / Offers CRUD
  const handleOpenCreatePromo = () => setPromoModal({ isOpen: true, promo: null });
  const handleOpenEditPromo = (promo) => setPromoModal({ isOpen: true, promo });

  const handleSubmitPromo = async (promoData) => {
    try {
      setIsSubmitting(true);
      const targetId = promoModal.promo?._id || promoData._id;
      if (targetId && targetId !== "undefined") {
        await api.updatePromoBanner(targetId, promoData);
        showToast(`Promo strip "${promoData.title}" updated!`);
      } else {
        await api.createPromoBanner(promoData);
        showToast(`Promo strip "${promoData.title}" created!`);
      }
      setPromoModal({ isOpen: false, promo: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save promo strip", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePromoPrompt = (promo) => {
    setDeleteModal({
      isOpen: true,
      type: "promo",
      id: promo._id,
      name: promo.title,
    });
  };

  const handleTogglePromoActive = async (promoId) => {
    try {
      await api.togglePromoBannerActive(promoId);
      showToast("Promo strip status updated!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to toggle promo status", "error");
    }
  };

  const handleReorderPromos = async (orderList) => {
    try {
      await api.reorderPromoBanners(orderList);
      showToast("Promo strips reordered!");
      onRefreshData();
    } catch (err) {
      showToast("Failed to reorder promo strips", "error");
    }
  };

  // Blog Management CRUD
  const handleOpenCreateBlog = () => setBlogModal({ isOpen: true, blog: null });
  const handleOpenEditBlog = (blog) => setBlogModal({ isOpen: true, blog });

  const handleSubmitBlog = async (blogData) => {
    try {
      setIsSubmitting(true);
      const targetId = blogModal.blog?._id || blogData._id;
      if (targetId && targetId !== "undefined") {
        await api.updateBlog(targetId, blogData);
        showToast(`Article "${blogData.title}" updated!`);
      } else {
        await api.createBlog(blogData);
        showToast(`Article "${blogData.title}" published!`);
      }
      setBlogModal({ isOpen: false, blog: null });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to save blog article", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlogPrompt = (blog) => {
    setDeleteModal({
      isOpen: true,
      type: "blog",
      id: blog._id,
      name: blog.title,
    });
  };

  const handleToggleBlogPublish = async (id) => {
    try {
      await api.togglePublishBlog(id);
      showToast("Publication status updated!");
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to update publication status", "error");
    }
  };

  const handleToggleBlogFeature = async (id) => {
    try {
      await api.toggleFeatureBlog(id);
      showToast("Spotlight status updated!");
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to update spotlight status", "error");
    }
  };

  // Inquiries
  const handleDeleteInquiryPrompt = (inquiry) => {
    setDeleteModal({
      isOpen: true,
      type: "inquiry",
      id: inquiry._id,
      name: `Inquiry from ${inquiry.name}`,
    });
  };

  // Confirmed Delete
  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      if (deleteModal.type === "product") {
        await api.deleteProduct(deleteModal.id);
        showToast("Product deleted from catalog.");
      } else if (deleteModal.type === "printing-service") {
        await api.deletePrintingService(deleteModal.id);
        showToast("Printing service removed from catalog.");
      } else if (deleteModal.type === "printing-category") {
        await api.deletePrintingCategory(deleteModal.id);
        showToast("Printing Category removed.");
      } else if (deleteModal.type === "category") {
        await api.deleteCategory(deleteModal.id);
        showToast("Product Category removed.");
      } else if (deleteModal.type === "service-category") {
        await api.deleteServiceCategory(deleteModal.id);
        showToast("Service Category removed.");
      } else if (deleteModal.type === "service") {
        await api.deleteService(deleteModal.id);
        showToast("IT Service deleted.");
      } else if (deleteModal.type === "banner") {
        await api.deleteBanner(deleteModal.id);
        showToast("Banner deleted.");
      } else if (deleteModal.type === "promo") {
        await api.deletePromoBanner(deleteModal.id);
        showToast("Promo strip deleted.");
      } else if (deleteModal.type === "blog") {
        await api.deleteBlog(deleteModal.id);
        showToast("Blog article deleted.");
      } else if (deleteModal.type === "inquiry") {
        await api.deleteInquiry(deleteModal.id);
        showToast("Inquiry archived.");
      }
      setDeleteModal({ isOpen: false, type: "product", id: null, name: "" });
      onRefreshData();
    } catch (err) {
      showToast(err.message || "Failed to delete item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        categoriesCount={(categories || []).length}
        printingServicesCount={(printingServices || []).length}
        printingCategoriesCount={(printingCategories || []).length}
        promoBannersCount={(promoBanners || []).length}
        blogsCount={(blogs || []).length}
        webTiersCount={webTiersCount}
        servicesCount={itServicesCount}
        serviceCategoriesCount={(serviceCategories || []).length}
        inquiriesCount={(inquiries || []).length}
        shopStatus={shopStatus}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isLiveBackend={isLiveBackend}
        onExitToStore={onExitToStore}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div className="admin-main">
        <AdminHeader
          activeTab={activeTab}
          onOpenProductModal={handleOpenCreateProduct}
          onOpenPrintingModal={handleOpenCreatePrintingService}
          onOpenPrintingCategoryModal={handleOpenCreatePrintingCategory}
          onOpenCategoryModal={handleOpenCreateCategory}
          onOpenServiceCategoryModal={handleOpenCreateServiceCategory}
          onOpenServiceModal={() => handleOpenCreateService({ isWebDevPackage: false })}
          onOpenWebTierModal={() =>
            handleOpenCreateService({ isWebDevPackage: true, category: "Web Development" })
          }
          onOpenBannerModal={handleOpenCreateBanner}
          onExitToStore={onExitToStore}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="admin-content">
          {activeTab === "overview" && (
            <DashboardOverview
              stats={stats}
              products={products}
              printingServices={printingServices}
              printingCategories={printingCategories}
              categories={categories}
              services={services}
              serviceCategories={serviceCategories}
              banners={banners}
              inquiries={inquiries}
              setActiveTab={setActiveTab}
              onOpenProductModal={handleOpenCreateProduct}
              onOpenCategoryModal={handleOpenCreateCategory}
              onOpenServiceModal={() => handleOpenCreateService({ isWebDevPackage: false })}
              onOpenBannerModal={handleOpenCreateBanner}
              onEditProduct={handleOpenEditProduct}
              onEditService={handleOpenEditService}
              onDeleteProduct={handleDeleteProductPrompt}
              onToggleProductAvailability={handleToggleProductAvailability}
              onToggleProductFeatured={handleToggleProductFeatured}
            />
          )}

          {activeTab === "shop-status" && (
            <ShopStatusManagement
              shopStatus={shopStatus}
              onUpdateShopStatus={onUpdateShopStatus}
              showToast={showToast}
            />
          )}

          {activeTab === "printing" && (
            <PrintingManagement
              printingServices={printingServices}
              printingCategories={printingCategories}
              onOpenCreateModal={handleOpenCreatePrintingService}
              onEditService={handleOpenEditPrintingService}
              onDeleteService={handleDeletePrintingServicePrompt}
              onToggleAvailability={handleTogglePrintingServiceAvailability}
              onToggleFeatured={handleTogglePrintingServiceFeatured}
              onManageCategories={() => setActiveTab("printing-categories")}
            />
          )}

          {activeTab === "printing-categories" && (
            <PrintingCategoryManagement
              categories={printingCategories}
              printingServices={printingServices}
              onOpenCreateModal={handleOpenCreatePrintingCategory}
              onEditCategory={handleOpenEditPrintingCategory}
              onDeleteCategory={handleDeletePrintingCategoryPrompt}
              onNavigateToPrintingServices={() => setActiveTab("printing")}
            />
          )}

          {activeTab === "web-tiers" && (
            <WebTiersManagement
              services={services}
              onOpenCreateModal={handleOpenCreateService}
              onEditService={handleOpenEditService}
              onDeleteService={handleDeleteServicePrompt}
              onToggleActive={handleToggleServiceActive}
              onToggleFeatured={handleToggleServiceFeatured}
              onExitToStore={onExitToStore}
            />
          )}

          {activeTab === "services" && (
            <ServicesManagement
              services={services}
              serviceCategories={serviceCategories}
              onOpenCreateModal={handleOpenCreateService}
              onEditService={handleOpenEditService}
              onDeleteService={handleDeleteServicePrompt}
              onToggleActive={handleToggleServiceActive}
              onToggleFeatured={handleToggleServiceFeatured}
              onManageCategories={() => setActiveTab("service-categories")}
            />
          )}

          {activeTab === "service-categories" && (
            <ServiceCategoryManagement
              categories={serviceCategories}
              services={services}
              onOpenCreateModal={handleOpenCreateServiceCategory}
              onEditCategory={handleOpenEditServiceCategory}
              onDeleteCategory={handleDeleteServiceCategoryPrompt}
              onNavigateToServices={() => setActiveTab("services")}
            />
          )}

          {activeTab === "products" && (
            <ProductManagement
              products={products}
              categories={categories}
              onOpenCreateModal={handleOpenCreateProduct}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProductPrompt}
              onToggleAvailability={handleToggleProductAvailability}
              onToggleFeatured={handleToggleProductFeatured}
            />
          )}

          {activeTab === "categories" && (
            <CategoryManagement
              categories={categories}
              products={products}
              onOpenCreateModal={handleOpenCreateCategory}
              onEditCategory={handleOpenEditCategory}
              onDeleteCategory={handleDeleteCategoryPrompt}
            />
          )}

          {activeTab === "banners" && (
            <BannerManagement
              banners={banners}
              onOpenCreateModal={handleOpenCreateBanner}
              onEditBanner={handleOpenEditBanner}
              onDeleteBanner={handleDeleteBannerPrompt}
              onToggleActive={handleToggleBannerActive}
              onReorderBanners={handleReorderBanners}
            />
          )}

          {activeTab === "promos" && (
            <PromoManagement
              promoBanners={promoBanners}
              onOpenCreateModal={handleOpenCreatePromo}
              onEditPromo={handleOpenEditPromo}
              onDeletePromo={handleDeletePromoPrompt}
              onToggleActive={handleTogglePromoActive}
              onReorderPromos={handleReorderPromos}
            />
          )}

          {activeTab === "about" && (
            <AboutManagement
              aboutData={aboutData}
              onUpdateAbout={onUpdateAbout}
              showToast={showToast}
            />
          )}

          {activeTab === "blogs" && (
            <BlogManagement
              blogs={blogs}
              onOpenCreateModal={handleOpenCreateBlog}
              onEditBlog={handleOpenEditBlog}
              onDeleteBlog={handleDeleteBlogPrompt}
              onTogglePublish={handleToggleBlogPublish}
              onToggleFeature={handleToggleBlogFeature}
              onViewLive={onNavigateToBlogLive}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesManagement
              inquiries={inquiries}
              onDeleteInquiry={handleDeleteInquiryPrompt}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        onSubmit={handleSubmitProduct}
        editingProduct={productModal.product}
        categories={categories}
        isSubmitting={isSubmitting}
      />

      <PrintingFormModal
        isOpen={printingModal.isOpen}
        onClose={() => setPrintingModal({ isOpen: false, service: null })}
        onSubmit={handleSubmitPrintingService}
        editingService={printingModal.service}
        printingCategories={printingCategories}
        isSubmitting={isSubmitting}
      />

      <PrintingCategoryFormModal
        isOpen={printingCategoryModal.isOpen}
        onClose={() => setPrintingCategoryModal({ isOpen: false, category: null })}
        onSubmit={handleSubmitPrintingCategory}
        editingCategory={printingCategoryModal.category}
        isSubmitting={isSubmitting}
      />

      <CategoryFormModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, category: null })}
        onSubmit={handleSubmitCategory}
        editingCategory={categoryModal.category}
        isSubmitting={isSubmitting}
      />

      <ServiceCategoryFormModal
        isOpen={serviceCategoryModal.isOpen}
        onClose={() => setServiceCategoryModal({ isOpen: false, category: null })}
        onSubmit={handleSubmitServiceCategory}
        editingCategory={serviceCategoryModal.category}
        isSubmitting={isSubmitting}
      />

      <ServiceFormModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ isOpen: false, service: null })}
        onSubmit={handleSubmitService}
        editingService={serviceModal.service}
        serviceCategories={serviceCategories}
        isSubmitting={isSubmitting}
      />

      <BannerFormModal
        isOpen={bannerModal.isOpen}
        onClose={() => setBannerModal({ isOpen: false, banner: null })}
        onSubmit={handleSubmitBanner}
        editingBanner={bannerModal.banner}
        isSubmitting={isSubmitting}
      />

      <PromoFormModal
        isOpen={promoModal.isOpen}
        onClose={() => setPromoModal({ isOpen: false, promo: null })}
        onSubmit={handleSubmitPromo}
        editingPromo={promoModal.promo}
        isSubmitting={isSubmitting}
      />

      <BlogFormModal
        isOpen={blogModal.isOpen}
        onClose={() => setBlogModal({ isOpen: false, blog: null })}
        onSubmit={handleSubmitBlog}
        editingBlog={blogModal.blog}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        type={deleteModal.type}
        itemName={deleteModal.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, type: "product", id: null, name: "" })}
        isDeleting={isSubmitting}
      />

      {/* Sleek Admin Action Loading Overlay with Backdrop Blur */}
      {isRefreshing && (
        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
          <div className="bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-bright)]/60 px-6 py-4 rounded-[var(--radius-lg)] shadow-2xl flex items-center gap-3.5 border border-white/10">
            <Loader2 size={20} className="animate-spin text-[var(--text-primary)]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--text-primary)] tracking-wide">
                Updating Records...
              </span>
              <span className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                Applying changes to catalog
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
