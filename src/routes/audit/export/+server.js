import { fail } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { _buildCatalogAuditResult as buildCatalogAuditResult } from "../+page.server.js";
import { createAuditWorkbook } from "$lib/utils/auditExport.js";
import { sendAuditEmails } from "$lib/utils/email.js";
import {
  syncAuditLeadToLoops,
  buildTopIssuesCopy,
} from "$lib/utils/loops.server.js";
import {
  getSupabaseClient,
  uploadAuditWorkbook,
} from "$lib/utils/supabase.server.js";

/** @type {import("./$types").RequestHandler} */
export const POST = async ({ request, fetch }) => {
  const formData = await request.formData();
  const email = (formData.get("email") || "").toString().trim();
  const consent = formData.get("consent");
  const storeUrl = (formData.get("storeUrl") || "").toString().trim();
  const storeNameRaw = (formData.get("storeName") || "").toString().trim();
  const storeName = storeNameRaw || null;
  const auditRequestId =
    (formData.get("auditRequestId") || "").toString().trim() || null;

  if (!email) {
    throw fail(400, { error: "Email is required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw fail(400, { error: "Please provide a valid email address." });
  }

  if (!consent) {
    throw fail(400, {
      error: "You must consent to be contacted about your audit.",
    });
  }

  if (!storeUrl) {
    throw fail(400, { error: "Missing store URL for this audit." });
  }

  const auditResult = await buildCatalogAuditResult({ storeUrl, fetch });

  if (!auditResult.ok) {
    throw fail(auditResult.status || 400, {
      error: auditResult.error || "Unable to rebuild audit for export.",
    });
  }

  if (!auditResult.report) {
    throw fail(400, {
      error:
        "We couldn't generate a full audit because no products were found. Please add products and rerun the audit.",
    });
  }

  // Artificial delay: preparing export data
  await new Promise((resolve) => setTimeout(resolve, 500));

  const agencyInfo = {
    name: env.AUDIT_AGENCY_NAME || "Will Misback",
    email:
      env.AUDIT_FROM_EMAIL || env.AUDIT_INTERNAL_EMAIL || "me@willmisback.com",
    website: env.AUDIT_AGENCY_WEBSITE || "https://willmisback.com",
    bookingUrl: env.AUDIT_BOOKING_URL || "https://willmisback.com/contact",
  };

  // Artificial delay: generating workbook
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const workbookBuffer = await createAuditWorkbook({
    storeUrl: auditResult.storeUrl,
    storeName: auditResult.storeName || storeName,
    myshopifyDomain: auditResult.myshopifyDomain,
    report: auditResult.report,
    agency: agencyInfo,
  });

  // Artificial delay: finalizing export
  await new Promise((resolve) => setTimeout(resolve, 600));

  const filenameSafeStore =
    (auditResult.storeName || auditResult.storeUrl || "store")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase() || "store";

  // Upload the workbook to Supabase Storage so we can link to it from Loops.
  let auditFileUrl = null;
  try {
    auditFileUrl = await uploadAuditWorkbook({
      buffer: workbookBuffer,
      storeSlug: filenameSafeStore,
    });
  } catch (error) {
    console.error("Failed to upload audit workbook to Supabase Storage", error);
  }

  // Persist the file URL on the audit_requests row (best-effort).
  if (auditFileUrl && auditRequestId) {
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from("audit_requests")
        .update({ audit_file_url: auditFileUrl })
        .eq("id", auditRequestId);
      if (updateError) {
        console.error(
          "Failed to update audit_requests with file URL",
          updateError
        );
      }
    } catch (error) {
      console.error("Error updating audit_requests with file URL", error);
    }
  }

  // Sync lead to Loops (non-blocking — don't fail the download if it fails).
  try {
    await syncAuditLeadToLoops({
      email,
      storeUrl: auditResult.storeUrl,
      storeName: auditResult.storeName || storeName,
      score: Math.round(auditResult.report.summary.overallScore),
      totalIssues: auditResult.report.summary.totalIssues,
      topIssues: buildTopIssuesCopy(auditResult.report),
      auditFileUrl,
    });
  } catch (error) {
    console.error("Failed to sync audit lead to Loops", error);
  }

  // Send emails but don't block the download if they fail.
  try {
    await sendAuditEmails({
      toUser: email,
      toInternal: env.AUDIT_INTERNAL_EMAIL || agencyInfo.email,
      consentGiven: Boolean(consent),
      storeUrl: auditResult.storeUrl,
      storeName: auditResult.storeName || storeName,
      report: auditResult.report,
      workbookBuffer,
    });
  } catch (error) {
    console.error("Failed to send audit emails", error);
  }

  return new Response(workbookBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filenameSafeStore}-catalog-audit.xlsx"`,
    },
  });
};
