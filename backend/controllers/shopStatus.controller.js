const ShopStatus = require("../models/shopStatus.model");

// Helper to get or create the single shop status document
const getOrCreateShopStatus = async () => {
  let status = await ShopStatus.findOne();
  if (!status) {
    status = await ShopStatus.create({
      isOpen: true,
      status: "open",
      title: "Pixel Perfect is Open",
      openTitle: "Pixel Perfect is Open & Operating",
      closedTitle: "We're Currently Closed",
      partialTitle: "Partial Service Availability • Selected Hours",
      closedMessage:
        "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
      partialMessage:
        "Some particular services are currently undergoing maintenance or unavailable, while our core stationery catalog and select digital services remain actively operational with their scheduled timings.",
      openMessage: "We are currently open and taking orders and consulting inquiries.",
      bannerNotice: "",
      timerEnabled: false,
      timerTarget: null,
      timerLabel: "Reopening In",
      timerAction: "reopen",
      showPopupWhenOpen: false,
      showPopupWhenClosed: true,
      showPopupWhenPartial: true,
      contactPhone: "+977 9845991878",
      contactEmail: "perfectpixel300@gmail.com",
      updatedBy: "Admin",
    });
  }
  return status;
};

// @desc    Get current shop status (Public)
// @route   GET /api/shop-status
exports.getShopStatus = async (req, res) => {
  try {
    let status = await getOrCreateShopStatus();

    // Dynamic timer auto-transition check
    if (status.timerEnabled && status.timerTarget && new Date() >= new Date(status.timerTarget)) {
      if (status.timerAction === "close" || status.status === "open" || status.status === "partial") {
        status.isOpen = false;
        status.status = "closed";
        status.timerEnabled = false;
        if (status.closedTitle) status.title = status.closedTitle;
        await status.save();
      } else if (status.timerAction === "reopen" || status.status === "closed") {
        status.isOpen = true;
        status.status = "open";
        status.timerEnabled = false;
        if (status.openTitle) status.title = status.openTitle;
        await status.save();
      }
    }

    res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error in getShopStatus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve shop status",
      error: error.message,
    });
  }
};

// @desc    Update shop status, messages, and timer (Admin Protected)
// @route   PUT /api/shop-status
exports.updateShopStatus = async (req, res) => {
  try {
    const {
      isOpen,
      status: reqStatus,
      title,
      openTitle,
      closedTitle,
      partialTitle,
      closedMessage,
      partialMessage,
      openMessage,
      bannerNotice,
      timerEnabled,
      timerTarget,
      timerLabel,
      timerAction,
      showPopupWhenOpen,
      showPopupWhenClosed,
      showPopupWhenPartial,
      contactPhone,
      contactEmail,
    } = req.body;

    let status = await getOrCreateShopStatus();

    if (reqStatus !== undefined) {
      status.status = reqStatus;
      if (reqStatus === "closed") {
        status.isOpen = false;
      } else {
        status.isOpen = true;
      }
    } else if (isOpen !== undefined) {
      status.isOpen = Boolean(isOpen);
      status.status = Boolean(isOpen) ? "open" : "closed";
    }

    if (openTitle !== undefined) status.openTitle = openTitle.trim();
    if (closedTitle !== undefined) status.closedTitle = closedTitle.trim();
    if (partialTitle !== undefined) status.partialTitle = partialTitle.trim();
    if (title !== undefined) {
      status.title = title.trim();
    } else if (status.status === "open" && status.openTitle) {
      status.title = status.openTitle;
    } else if (status.status === "closed" && status.closedTitle) {
      status.title = status.closedTitle;
    } else if (status.status === "partial" && status.partialTitle) {
      status.title = status.partialTitle;
    }

    if (closedMessage !== undefined) status.closedMessage = closedMessage.trim();
    if (partialMessage !== undefined) status.partialMessage = partialMessage.trim();
    if (openMessage !== undefined) status.openMessage = openMessage.trim();
    if (bannerNotice !== undefined) status.bannerNotice = bannerNotice.trim();
    if (timerEnabled !== undefined) status.timerEnabled = Boolean(timerEnabled);
    if (timerTarget !== undefined) {
      status.timerTarget = timerTarget ? new Date(timerTarget) : null;
    }
    if (timerLabel !== undefined) status.timerLabel = timerLabel.trim();
    if (timerAction !== undefined) status.timerAction = timerAction;
    if (showPopupWhenOpen !== undefined) {
      status.showPopupWhenOpen = Boolean(showPopupWhenOpen);
    }
    if (showPopupWhenClosed !== undefined) {
      status.showPopupWhenClosed = Boolean(showPopupWhenClosed);
    }
    if (showPopupWhenPartial !== undefined) {
      status.showPopupWhenPartial = Boolean(showPopupWhenPartial);
    }
    if (contactPhone !== undefined) status.contactPhone = contactPhone.trim();
    if (contactEmail !== undefined) status.contactEmail = contactEmail.trim();

    status.updatedBy = req.user?.username || req.user?.name || "Admin";

    const savedStatus = await status.save();

    res.status(200).json({
      success: true,
      message: `Shop status updated to ${savedStatus.isOpen ? "OPEN" : "CLOSED"}`,
      status: savedStatus,
    });
  } catch (error) {
    console.error("Error in updateShopStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update shop status",
    });
  }
};
