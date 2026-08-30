const ShopStatus = require("../models/shopStatus.model");

// Helper to get or create the single shop status document
const getOrCreateShopStatus = async () => {
  let status = await ShopStatus.findOne();
  if (!status) {
    status = await ShopStatus.create({
      isOpen: true,
      title: "Pixel Perfect Atelier is Open",
      closedMessage:
        "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
      openMessage: "We are currently open and taking orders and consulting inquiries.",
      bannerNotice: "",
      timerEnabled: false,
      timerTarget: null,
      timerLabel: "Reopening In",
      timerAction: "reopen",
      showPopupWhenClosed: true,
      contactPhone: "+977 9845991878",
      contactEmail: "atelier@pixelperfect.com",
      updatedBy: "Admin",
    });
  }
  return status;
};

// @desc    Get current shop status (Public)
// @route   GET /api/shop-status
exports.getShopStatus = async (req, res) => {
  try {
    const status = await getOrCreateShopStatus();
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
      partialTitle,
      closedMessage,
      partialMessage,
      openMessage,
      bannerNotice,
      timerEnabled,
      timerTarget,
      timerLabel,
      timerAction,
      showPopupWhenClosed,
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

    if (title !== undefined) status.title = title.trim();
    if (partialTitle !== undefined) status.partialTitle = partialTitle.trim();
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
    if (showPopupWhenClosed !== undefined) {
      status.showPopupWhenClosed = Boolean(showPopupWhenClosed);
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
