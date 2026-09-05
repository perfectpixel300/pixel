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
function buildInquiryEmailTemplate({ name, email, phone, subject, message, productTitle, createdAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
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
                  safePhone
                    ? `<tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Phone Number
                  </td>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #27272a; font-size: 14px; font-weight: 600; color: #ffffff;">
                    <a href="tel:${safePhone}" style="color: #ffffff; text-decoration: none;">${safePhone}</a>
                  </td>
                </tr>`
                    : ""
                }
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
${phone ? `Sender Phone:   ${phone}\n` : ""}${productTitle ? `Inquired Item:  ${productTitle}\n` : ""}Subject:        ${subject || "General Inquiry"}
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
 * @param {string} [params.phone] - Sender phone
 * @param {string} [params.subject] - Inquiry subject
 * @param {string} params.message - Inquiry message body
 * @param {string} [params.productTitle] - Product/Service title if applicable
 * @param {Date|string} [params.createdAt] - Creation timestamp
 */
async function sendInquiryNotification({ name, email, phone, subject, message, productTitle, createdAt }) {
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
    phone,
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

/**
 * Build HTML and Plain Text templates for review confirmation email
 */
function buildReviewConfirmationEmailTemplate({ firstName, lastName, rating, comment, productName }) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const safeName = escapeHtml(fullName || firstName || "Valued Customer");
  const safeProductName = escapeHtml(productName || "Product");
  const safeComment = escapeHtml(comment).replace(/\n/g, "<br/>");
  const starCount = Math.max(1, Math.min(5, Number(rating) || 5));
  const starsString = "★".repeat(starCount) + "☆".repeat(5 - starCount);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Received - Pixel Perfect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0d0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0d0e; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #141517; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.5);" cellspacing="0" cellpadding="0" border="0">
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
                      Review Submitted Successfully
                    </h1>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 6px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; background-color: #27272a; color: #34d399; border-radius: 20px;">
                      Verified Submission
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f4f4f5; line-height: 1.5;">
                Hello <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Thank you for sharing your feedback on <strong>${safeProductName}</strong>. Your review has been submitted successfully and added to our catalog.
              </p>

              <!-- Review Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; border-spacing: 0; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; width: 140px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Product
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; font-size: 14px; font-weight: 600; color: #ffffff;">
                    ${safeProductName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
                    Rating
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #27272a; font-size: 16px; color: #fbbf24; font-weight: bold; letter-spacing: 2px;">
                    ${starsString} <span style="font-size: 13px; color: #a1a1aa; font-weight: normal; margin-left: 6px;">(${starCount} / 5 stars)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; vertical-align: top;">
                    Review
                  </td>
                  <td style="padding: 14px 18px; font-size: 14px; color: #e4e4e7; line-height: 1.6;">
                    &ldquo;${safeComment}&rdquo;
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #a1a1aa; line-height: 1.6;">
                For your privacy, your email address is never displayed publicly on the website.
              </p>

              <div style="margin-top: 24px; padding: 14px 18px; background-color: #18181b; border-left: 3px solid #34d399; border-radius: 4px; font-size: 13px; color: #a1a1aa;">
                Have questions about your order or need custom production? Reply directly to this email or visit our website.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #09090b; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #71717a;">
              Pixel Perfect &bull; Design, Engineering &amp; Fine Print Catalog
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
PIXEL PERFECT - REVIEW CONFIRMATION
===================================

Hello ${fullName || firstName || "Valued Customer"},

Your review for "${productName}" has been submitted successfully!

Product: ${productName}
Rating:  ${starCount} / 5 Stars (${starsString})
Review:
"${comment}"

For your privacy, your email address is never published publicly.

Thank you for choosing Pixel Perfect!
`;

  return { html, text };
}

/**
 * Send review confirmation email to user via Brevo REST API
 */
async function sendReviewConfirmationEmail({ toEmail, firstName, lastName, rating, comment, productName }) {
  if (!toEmail || !toEmail.includes("@")) {
    return { success: false, reason: "invalid_email" };
  }

  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || "perfectpixel300@gmail.com").trim();
  const senderName = (process.env.BREVO_SENDER_NAME || "Pixel Perfect").trim();

  if (!apiKey) {
    console.warn("[Email Service] Notice: BREVO_API_KEY is not configured. Review saved, but confirmation email skipped.");
    return { success: false, reason: "apiKey_missing" };
  }

  const { html, text } = buildReviewConfirmationEmailTemplate({
    firstName,
    lastName,
    rating,
    comment,
    productName,
  });

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: toEmail.trim(),
        name: [firstName, lastName].filter(Boolean).join(" ") || firstName || "Customer",
      },
    ],
    subject: `Your review for "${productName || "Product"}" has been submitted! - Pixel Perfect`,
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
      console.error("[Email Service] Brevo API rejected review confirmation email:", data.message || response.statusText);
      return { success: false, error: data.message };
    }

    console.log(`[Email Service] Review confirmation email sent to ${toEmail} (MessageId: ${data.messageId || "ok"})`);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("[Email Service] Error sending review confirmation email:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Build HTML and Plain Text templates for account activation email
 */
function buildActivationEmailTemplate({ activationLink, email }) {
  const safeEmail = escapeHtml(email || "");
  const safeLink = escapeHtml(activationLink || "#");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate Your Account - Pixel Perfect</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #090a0f; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #121318; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px; background-color: #09090b; border-bottom: 1px solid #27272a; text-align: left;">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #a1a1aa; margin-bottom: 6px;">
                PIXEL PERFECT
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                Verify Your Email Address
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f4f4f5; line-height: 1.6;">
                Welcome to <strong>Pixel Perfect</strong>!
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                You recently registered with the email address <strong style="color: #ffffff;">${safeEmail}</strong>. To complete your account setup and activate your account, please verify your email address by clicking the button below:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${safeLink}" style="display: inline-block; background-color: #ffffff; color: #09090b; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.02em; box-shadow: 0 4px 14px rgba(255,255,255,0.2);">
                  Activate &amp; Verify Account &rarr;
                </a>
              </div>

              <!-- Expiry Note -->
              <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
                  ⏱️ <strong>Note:</strong> This verification link will expire in <strong>24 hours</strong>. After verifying, you will be prompted to enter your profile details (name, contact, address, landmark, and birth date).
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 12px; word-break: break-all; color: #38bdf8;">
                <a href="${safeLink}" style="color: #38bdf8; text-decoration: underline;">${safeLink}</a>
              </p>

              <div style="border-top: 1px solid #27272a; padding-top: 20px; font-size: 12px; color: #71717a; line-height: 1.5;">
                If you did not register for an account at Pixel Perfect, please safely disregard this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #09090b; border-top: 1px solid #27272a; text-align: center; font-size: 11px; color: #71717a;">
              Pixel Perfect &bull; Design, Engineering &amp; Fine Print Catalog
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
PIXEL PERFECT - ACCOUNT ACTIVATION
===================================

Welcome to Pixel Perfect!

You registered with the email: ${email}

To activate your account and complete your profile setup, please open the following link in your browser:
${activationLink}

This activation link will expire in 24 hours.

Once verified, you can complete your profile information (full name, contact number, address, landmark, and date of birth).

If you did not create an account on Pixel Perfect, you can safely ignore this email.
`;

  return { html, text };
}

/**
 * Send account activation / email verification email via Brevo REST API
 */
async function sendActivationEmail({ toEmail, activationLink }) {
  if (!toEmail || !toEmail.includes("@")) {
    return { success: false, reason: "invalid_email" };
  }

  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || "perfectpixel300@gmail.com").trim();
  const senderName = (process.env.BREVO_SENDER_NAME || "Pixel Perfect").trim();

  if (!apiKey) {
    console.warn("[Email Service] Notice: BREVO_API_KEY is not configured. Activation email skipped.");
    return { success: false, reason: "apiKey_missing", activationLink };
  }

  const { html, text } = buildActivationEmailTemplate({
    activationLink,
    email: toEmail,
  });

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: toEmail.trim(),
        name: toEmail.split("@")[0],
      },
    ],
    subject: "Activate your Pixel Perfect Account - Email Verification",
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
      console.error("[Email Service] Brevo API rejected activation email:", data.message || response.statusText);
      return { success: false, error: data.message, activationLink };
    }

    console.log(`[Email Service] Activation email sent to ${toEmail} (MessageId: ${data.messageId || "ok"})`);
    return { success: true, messageId: data.messageId, activationLink };
  } catch (err) {
    console.error("[Email Service] Error sending activation email:", err.message);
    return { success: false, error: err.message, activationLink };
  }
}

module.exports = {
  sendInquiryNotification,
  sendReviewConfirmationEmail,
  sendActivationEmail,
};

