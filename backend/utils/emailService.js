/**
 * Service to handle transactional email sending via Brevo REST API.
 * Uses native fetch to call Brevo's email API endpoint:
 * POST https://api.brevo.com/v3/smtp/email
 */

// Helper to escape HTML characters to prevent XSS / injection in email bodies
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Build HTML and Plain Text templates for inquiry notifications
 */
function buildInquiryEmailTemplate({ name, email, subject, message, productTitle, createdAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || "General Inquiry");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
  const safeProductTitle = productTitle ? escapeHtml(productTitle) : "";
  const submissionDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", { timeZoneName: "short" })
    : new Date().toLocaleString("en-US", { timeZoneName: "short" });

  const isProductOrService = Boolean(safeProductTitle);
  const emailTitle = isProductOrService
    ? `Inquiry for: ${safeProductTitle}`
    : `Contact Message: ${safeSubject}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(emailTitle)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0d0e; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #141517; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.5);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px; background-color: #09090b; border-bottom: 1px solid #27272a;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #a1a1aa;">
                      PIXEL PERFECT
                    </div>
                    <h1 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                      ${isProductOrService ? "Product / Service Inquiry" : "Website Contact Form"}
                    </h1>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 6px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; background-color: #27272a; color: #e4e4e7; border-radius: 20px;">
                      ${isProductOrService ? "Direct Inquiry" : "Correspondence"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 22px 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">
                A new inquiry has been submitted through the Pixel Perfect website form:
              </p>

              <!-- Details Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; border-spacing: 0; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; width: 140px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Sender Name
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 14px; font-weight: 600; color: #ffffff;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Sender Email
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 14px; color: #38bdf8;">
                    <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                ${
                  safeProductTitle
                    ? `<tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Inquired Item
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 14px; font-weight: 600; color: #f43f5e;">
                    ${safeProductTitle}
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Subject
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 14px; color: #e4e4e7;">
                    ${safeSubject}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Timestamp
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #a1a1aa;">
                    ${submissionDate}
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a1a1aa;">
                Inquiry Message:
              </div>
              <div style="padding: 18px 20px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #f4f4f5; word-break: break-word;">
                ${safeMessage}
              </div>

              <!-- Quick Reply Info -->
              <div style="margin-top: 24px; padding: 14px 18px; background-color: #18181b; border-left: 3px solid #ffffff; border-radius: 4px; font-size: 13px; color: #a1a1aa;">
                <strong>Direct Reply:</strong> You can hit <span style="color: #ffffff;">Reply</span> in your email client to respond directly to <span style="color: #ffffff;">${safeName}</span> (<a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none;">${safeEmail}</a>).
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #09090b; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #71717a;">
              Pixel Perfect &bull; Automated Inquiry &amp; Contact Dispatcher
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const text = `
PIXEL PERFECT - NEW INQUIRY NOTIFICATION
========================================

A new inquiry has been submitted through the website form:

Sender Name:    ${name}
Sender Email:   ${email}
${productTitle ? `Inquired Item:  ${productTitle}\n` : ""}Subject:        ${subject || "General Inquiry"}
Date & Time:    ${submissionDate}

----------------------------------------
MESSAGE:
----------------------------------------
${message}
----------------------------------------

* You can reply directly to this email to contact ${name} (${email}).
`;

  return { html, text, emailTitle };
}

/**
 * Send inquiry notification email using Brevo REST API
 *
 * @param {Object} params
 * @param {string} params.name - Sender name
 * @param {string} params.email - Sender email
 * @param {string} [params.subject] - Inquiry subject
 * @param {string} params.message - Inquiry message body
 * @param {string} [params.productTitle] - Product/Service title if applicable
 * @param {Date|string} [params.createdAt] - Creation timestamp
 */
async function sendInquiryNotification({ name, email, subject, message, productTitle, createdAt }) {
  const apiKey = (process.env.BREVO_API_KEY || "").trim();

  // Target receiver email (defaults to perfectpixel300@gmail.com, configurable via env)
  const receiverEmail = (process.env.CONTACT_RECEIVER_EMAIL || "perfectpixel300@gmail.com").trim();

  // Brevo sender email (defaults to receiverEmail or BREVO_SENDER_EMAIL)
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || receiverEmail).trim();
  const senderName = (process.env.BREVO_SENDER_NAME || "Pixel Perfect Website").trim();

  if (!apiKey) {
    console.warn(
      "[Email Service] Notice: BREVO_API_KEY is not configured in .env. Inquiry was saved to database, but email dispatch was skipped."
    );
    return {
      success: false,
      reason: "apiKey_missing",
      message: "BREVO_API_KEY not configured in environment variables",
    };
  }

  const { html, text } = buildInquiryEmailTemplate({
    name,
    email,
    subject,
    message,
    productTitle,
    createdAt,
  });

  const emailSubject = `[Pixel Perfect Inquiry] ${productTitle ? `${productTitle} - ` : ""}${name}: ${subject || "General Inquiry"}`;

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: receiverEmail,
        name: "Pixel Perfect Admin",
      },
    ],
    replyTo: {
      email,
      name,
    },
    subject: emailSubject,
    htmlContent: html,
    textContent: text,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg = data.message || `Brevo API HTTP ${response.status}: ${response.statusText}`;
      console.error(`[Email Service] Brevo API rejected email:`, errMsg);
      return {
        success: false,
        error: errMsg,
        details: data,
      };
    }

    console.log(
      `[Email Service] Notification sent successfully to ${receiverEmail} via Brevo API (MessageId: ${data.messageId || "ok"})`
    );
    return {
      success: true,
      messageId: data.messageId,
    };
  } catch (err) {
    console.error(`[Email Service] Network/fetch error while contacting Brevo API:`, err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

module.exports = {
  sendInquiryNotification,
};
