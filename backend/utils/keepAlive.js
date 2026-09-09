const https = require("https");
const http = require("http");

/**
 * Initializes a keep-alive background ping to prevent Render free-tier instances from sleeping.
 * Render spins down free web services after 15 minutes of inactivity.
 * Pinging the service externally every 14 minutes (840,000 ms) resets Render's inactivity timer.
 */
const initKeepAlive = () => {
  const targetUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    process.env.SERVER_URL;

  if (!targetUrl) {
    console.log(
      "[Keep-Alive] No RENDER_EXTERNAL_URL or BACKEND_URL detected. For local development, self-ping is disabled. In production, uptime monitoring (e.g., UptimeRobot) can ping /api/health."
    );
    return;
  }

  const pingUrl = `${targetUrl.replace(/\/+$/, "")}/api/health`;
  const intervalMinutes = 14;
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(
    `[Keep-Alive] Active. Auto-pinging ${pingUrl} every ${intervalMinutes} minutes to prevent sleep.`
  );

  const client = pingUrl.startsWith("https") ? https : http;

  const pingServer = () => {
    try {
      const req = client.get(pingUrl, (res) => {
        // Consume response data to free up memory
        res.resume();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(
            `[Keep-Alive] Ping successful (${res.statusCode}) at ${new Date().toISOString()}`
          );
        } else {
          console.warn(
            `[Keep-Alive] Ping returned status ${res.statusCode} at ${new Date().toISOString()}`
          );
        }
      });

      req.on("error", (err) => {
        console.error(`[Keep-Alive Error] Ping failed: ${err.message}`);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.warn("[Keep-Alive Timeout] Ping request timed out.");
      });
    } catch (error) {
      console.error(`[Keep-Alive Exception] ${error.message}`);
    }
  };

  // Initial ping after 1 minute, then interval
  setTimeout(pingServer, 60 * 1000);
  const timer = setInterval(pingServer, intervalMs);

  if (timer.unref) {
    timer.unref();
  }
};

module.exports = initKeepAlive;
