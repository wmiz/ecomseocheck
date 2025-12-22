import { Resend } from "resend";
import { env } from "$env/dynamic/private";

/**
 * Send audit emails to the user and to the internal agency mailbox.
 *
 * @param {Object} params
 * @param {string} params.toUser
 * @param {string} params.toInternal
 * @param {boolean} params.consentGiven
 * @param {string} params.storeUrl
 * @param {string | null} params.storeName
 * @param {any} params.report
 * @param {Buffer} params.workbookBuffer
 */
export async function sendAuditEmails({
  toUser,
  toInternal,
  consentGiven,
  storeUrl,
  storeName,
  report,
  workbookBuffer,
}) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; skipping audit email send.");
    return;
  }

  const resend = new Resend(apiKey);

  const fromEmail =
    env.AUDIT_FROM_EMAIL || "Audit Report <onboarding@resend.dev>";
  const bookingUrl = env.AUDIT_BOOKING_URL || "https://willmisback.com/contact";

  const score = Math.round(report.summary.overallScore);
  const grade = report.summary.overallGrade;
  const label = report.summary.overallLabel;
  const friendlyStore = storeName || storeUrl;

  const attachmentFilename = `${(storeName || "store")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()}-catalog-audit.xlsx`;

  const attachment = {
    filename: attachmentFilename,
    content: workbookBuffer.toString("base64"),
  };

  // Email to user
  await resend.emails.send({
    from: fromEmail,
    to: toUser,
    subject: `Your Shopify Catalog Audit – ${score}/100 (${grade})`,
    html: `
      <h2>Your Shopify Catalog Audit</h2>
      <p>Hi,</p>
      <p>Attached is your catalog health audit for <strong>${friendlyStore}</strong>.</p>
      <p><strong>Grade:</strong> ${score}/100 (${grade})</p>
      <p>${label}</p>
      <p>
        When you're ready, you can book a fix call here:
        <a href="${bookingUrl}">${bookingUrl}</a>.
      </p>
      <p>— Will</p>
    `,
    attachments: [attachment],
  });

  // Email to internal agency
  if (toInternal) {
    await resend.emails.send({
      from: fromEmail,
      to: toInternal,
      subject: `New Audit Download Lead – ${score}/100 (${grade})`,
      html: `
        <h2>New Audit Download Lead</h2>
        <p><strong>Email:</strong> ${toUser}</p>
        <p><strong>Consented to Contact:</strong> ${
          consentGiven ? "Yes" : "No"
        }</p>
        <p><strong>Store:</strong> ${friendlyStore}</p>
        <p><strong>Store URL:</strong> ${storeUrl}</p>
        <p><strong>Grade:</strong> ${score}/100 (${grade})</p>
        <p><strong>Summary:</strong> ${label}</p>
        <p>The full workbook is attached.</p>
      `,
      attachments: [attachment],
    });
  }
}
