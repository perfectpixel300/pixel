const mongoose = require("mongoose");

/**
 * Health check handler for uptime monitors and keep-alive pings
 * Returns server uptime, database status, timestamp, and memory metrics.
 */
const getHealthStatus = (req, res) => {
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const memory = process.memoryUsage();

  res.status(200).json({
    status: "ok",
    message: "Server is healthy and awake",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: `${hours}h ${minutes}m ${seconds}s`,
    },
    database: {
      status: dbStatusMap[mongoose.connection.readyState] || "unknown",
      readyState: mongoose.connection.readyState,
    },
    system: {
      memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memory.heapTotal / 1024 / 1024),
    },
  });
};

/**
 * Lightweight ping handler for low-bandwidth uptime checks
 */
const getPing = (req, res) => {
  res.status(200).send("pong");
};

module.exports = {
  getHealthStatus,
  getPing,
};
