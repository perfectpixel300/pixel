import React, { createContext, useContext, useState, useEffect } from "react";

const PWAContext = createContext(null);

export function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showFirstVisitModal, setShowFirstVisitModal] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Check if currently running as installed standalone PWA
  const checkIsStandalone = () => {
    if (typeof window === "undefined") return false;
    const isStandalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isAndroidApp = document.referrer && document.referrer.includes("android-app://");
    const isStoredInstalled = localStorage.getItem("pixel_pwa_installed") === "true";

    return Boolean(isStandalone || isIOSStandalone || isAndroidApp || isStoredInstalled);
  };

  useEffect(() => {
    // Initial standalone check
    const currentlyInstalled = checkIsStandalone();
    setIsInstalled(currentlyInstalled);

    // If already installed, never show first-visit modal
    if (currentlyInstalled) {
      setShowFirstVisitModal(false);
      return;
    }

    // Capture beforeinstallprompt event for Chrome/Edge/Android
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      const isDismissed = localStorage.getItem("pixel_pwa_first_visit_dismissed") === "true";
      if (!checkIsStandalone() && !isDismissed) {
        setTimeout(() => {
          if (!checkIsStandalone()) {
            setShowFirstVisitModal(true);
          }
        }, 1200);
      }
    };

    // Track app installation completion
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowFirstVisitModal(false);
      localStorage.setItem("pixel_pwa_installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Fallback timer for browsers that don't emit beforeinstallprompt (e.g. iOS Safari)
    const isDismissed = localStorage.getItem("pixel_pwa_first_visit_dismissed") === "true";
    if (!currentlyInstalled && !isDismissed) {
      const timer = setTimeout(() => {
        if (!checkIsStandalone()) {
          setShowFirstVisitModal(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Programmatic installation trigger
  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
          localStorage.setItem("pixel_pwa_installed", "true");
          setShowFirstVisitModal(false);
        }
        setDeferredPrompt(null);
        return choiceResult.outcome;
      } catch (err) {
        console.error("PWA install error:", err);
      }
    } else {
      // Check if iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        setShowIOSInstructions(true);
      } else {
        alert("To install Pixel Perfect, open your browser menu (⋮ or Share) and select 'Install app' or 'Add to Home screen'.");
      }
    }
  };

  const dismissFirstVisitModal = () => {
    setShowFirstVisitModal(false);
    localStorage.setItem("pixel_pwa_first_visit_dismissed", "true");
  };

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        showFirstVisitModal,
        setShowFirstVisitModal,
        showIOSInstructions,
        setShowIOSInstructions,
        installApp,
        dismissFirstVisitModal,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
}
