import ExcelJS from "exceljs";

/**
 * Map an issue id/category to a business-impact recommendation string.
 * @param {string} issueId
 */
function getRecommendation(issueId) {
  switch (issueId) {
    case "missing_image_alt":
      return "Hurts Google ranking and accessibility; search engines and screen-reader users can’t understand your product images.";
    case "thin_descriptions":
      return "Thin or missing descriptions reduce conversion and search visibility; shoppers lack enough information to buy.";
    case "duplicate_products":
      return "Duplicate products can cannibalize SEO and confuse shoppers about which item to purchase.";
    case "title_length":
      return "Titles that are too short or too long either lack clarity or get truncated in search results.";
    case "missing_images":
      return "Products without images look broken and almost never sell.";
    case "pricing_anomalies":
      return "Suspicious sale pricing erodes trust and can cause compliance issues.";
    case "missing_skus":
      return "Missing SKUs break inventory, 3PL, and ERP integrations.";
    case "missing_weights":
      return "Missing weights can break shipping rate calculations and hurt margins.";
    case "vendor_fragmentation":
      return "Inconsistent vendor names fragment reporting and collections.";
    case "tag_soup":
      return "Messy, one-off tags make filters and reporting noisy and hard to use.";
    case "variant_completeness":
      return "Incomplete variants and inventory metadata create broken options and overselling risk.";
    case "orphaned_products":
      return "Recently updated but hidden products are missed launch or revenue opportunities.";
    case "large_images":
      return "Oversized images slow pages, especially on mobile, hurting conversion.";
    default:
      return "This issue hurts discoverability, conversion, or operations and is likely costing you revenue.";
  }
}

/**
 * Extract the myshopify.com domain from a store URL.
 * @param {string} storeUrl
 * @returns {string | null}
 */
function extractShopifyDomain(storeUrl) {
  if (!storeUrl) return null;

  // Remove protocol
  let domain = storeUrl.replace(/^https?:\/\//i, "").trim();
  // Remove trailing slashes
  domain = domain.replace(/\/+$/, "");

  // Extract myshopify.com domain
  const match = domain.match(/([a-z0-9-]+\.myshopify\.com)/i);
  if (match) {
    return match[1].toLowerCase();
  }

  return null;
}

/**
 * Build a Shopify admin product URL.
 * @param {string} shopDomain - The myshopify.com domain
 * @param {string | number} productId - The product ID
 * @returns {string | null}
 */
function buildProductAdminUrl(shopDomain, productId) {
  if (!shopDomain || !productId) return null;
  return `https://${shopDomain}/admin/products/${productId}`;
}

/**
 * Build a Shopify admin variant URL.
 * @param {string} shopDomain - The myshopify.com domain
 * @param {string | number} productId - The product ID
 * @param {string | number} variantId - The variant ID
 * @returns {string | null}
 */
function buildVariantAdminUrl(shopDomain, productId, variantId) {
  if (!shopDomain || !productId || !variantId) return null;
  return `https://${shopDomain}/admin/products/${productId}/variants/${variantId}`;
}

/**
 * Extract product and variant IDs from an instance.
 * @param {any} instance
 * @returns {{ productId: string | number | null, variantId: string | number | null }}
 */
function extractIds(instance) {
  if (!instance) return { productId: null, variantId: null };

  let productId = null;
  let variantId = null;

  // Check if instance has a product object
  if (instance.product) {
    productId = instance.product.id || null;
    variantId = instance.variantId || null;
  } else if (instance.id) {
    // Direct product reference
    productId = instance.id;
    variantId = instance.variantId || null;
  } else if (Array.isArray(instance)) {
    // For clusters, we can't link to a single product
    return { productId: null, variantId: null };
  }

  return { productId, variantId };
}

/**
 * Build a human-readable label for a specific issue instance.
 * @param {any} instance
 */
function formatInstanceLabel(instance) {
  if (!instance) return "";

  // If this is already a lightweight product ref.
  if (instance.title || instance.handle) {
    return `${instance.title || ""}${
      instance.handle ? ` (${instance.handle})` : ""
    }`.trim();
  }

  if (instance.tag) return instance.tag;
  if (instance.normalized && instance.variants) {
    return `${instance.normalized}: ${instance.variants.join(", ")}`;
  }

  if (instance.normalized) return instance.normalized;

  // Fallback to JSON string if we don't recognize the shape.
  try {
    return JSON.stringify(instance);
  } catch {
    return "";
  }
}

/**
 * Flatten the section/issue structure into rows for the Data tab.
 * @param {any} report
 * @param {string | null} myshopifyDomain - The myshopify.com domain from meta.json
 * @param {string} storeUrl - Fallback store URL to parse domain from if myshopifyDomain is not available
 */
function buildDataRows(report, myshopifyDomain, storeUrl) {
  const rows = [];
  // Use myshopifyDomain from meta.json if available, otherwise try to extract from storeUrl
  const shopDomain = myshopifyDomain || extractShopifyDomain(storeUrl);

  for (const section of report.sections || []) {
    for (const issue of section.issues || []) {
      const base = {
        sectionId: section.id,
        sectionTitle: section.title,
        issueId: issue.id,
        issueLabel: issue.label,
        severity: issue.severity,
        description: issue.description ?? "",
        recommendation: getRecommendation(issue.id),
      };

      // If we have full per-instance detail, explode each instance into its own row.
      if (issue.instances) {
        // Tag soup returns a grouped object; handle its pieces explicitly.
        if (
          !Array.isArray(issue.instances) &&
          typeof issue.instances === "object"
        ) {
          const { singleUse = [] } = issue.instances;

          for (const inst of singleUse) {
            rows.push({
              ...base,
              instanceType: "tag_single_use",
              instanceDetail: formatInstanceLabel(inst),
              productLink: null,
              variantLink: null,
            });
          }

          continue;
        }

        for (const inst of issue.instances) {
          // Duplicate clusters and similar checks may return arrays of products.
          if (Array.isArray(inst)) {
            const label = inst
              .map((p) => p.title || p.handle || p.id || "")
              .filter(Boolean)
              .join(", ");

            rows.push({
              ...base,
              instanceType: "cluster",
              instanceDetail: label,
              productLink: null,
              variantLink: null,
            });
          } else {
            const { productId, variantId } = extractIds(inst);
            const productLink =
              productId && shopDomain
                ? buildProductAdminUrl(shopDomain, productId)
                : null;
            const variantLink =
              productId && variantId && shopDomain
                ? buildVariantAdminUrl(shopDomain, productId, variantId)
                : null;

            rows.push({
              ...base,
              instanceType: "instance",
              instanceDetail: formatInstanceLabel(
                inst.product ? inst.product : inst
              ),
              productLink,
              variantLink,
            });
          }
        }
      } else {
        // Backwards-compatible fallback: just summarize the first example.
        const ex = issue.examples?.[0];
        let label = "";
        let productLink = null;
        let variantLink = null;

        if (Array.isArray(ex)) {
          label = ex
            .map((p) => p.title || p.handle || p.id || "")
            .filter(Boolean)
            .join(", ");
        } else if (ex) {
          label = formatInstanceLabel(ex);
          const { productId, variantId } = extractIds(ex);
          productLink =
            productId && shopDomain
              ? buildProductAdminUrl(shopDomain, productId)
              : null;
          variantLink =
            productId && variantId && shopDomain
              ? buildVariantAdminUrl(shopDomain, productId, variantId)
              : null;
        }

        rows.push({
          ...base,
          instanceType: "example",
          instanceDetail: label,
          productLink,
          variantLink,
        });
      }
    }
  }

  return rows;
}

/**
 * Create a 2-tab workbook (Summary + Data) and return a Buffer.
 *
 * @param {Object} params
 * @param {string} params.storeUrl
 * @param {string | null} params.storeName
 * @param {string | null} params.myshopifyDomain - The myshopify.com domain from meta.json
 * @param {any} params.report
 * @param {{ name: string; email: string; website?: string; bookingUrl?: string }} params.agency
 */
export async function createAuditWorkbook({
  storeUrl,
  storeName,
  myshopifyDomain,
  report,
  agency,
}) {
  const workbook = new ExcelJS.Workbook();

  const now = new Date();
  const dateString = now.toISOString().slice(0, 10);

  // --- Summary sheet ---
  const summarySheet = workbook.addWorksheet("Summary");

  const agencyName = agency.name || "Your Agency";
  // Treat the configured booking URL as the primary Stripe checkout / upgrade URL.
  const checkoutUrl = agency.bookingUrl || agency.website || storeUrl;

  summarySheet.columns = [
    { header: "Label", key: "label", width: 25 },
    { header: "Value", key: "value", width: 60 },
  ];

  summarySheet.mergeCells("A1:B1");
  const titleCell = summarySheet.getCell("A1");
  titleCell.value = `${agencyName} – Catalog Health Audit Summary`;
  titleCell.font = { size: 18, bold: true, color: { argb: "FF111827" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  summarySheet.getRow(1).height = 28;

  summarySheet.mergeCells("A3:B3");
  const ctaCell = summarySheet.getCell("A3");
  ctaCell.value = {
    text: "Fix these catalog issues",
    hyperlink: checkoutUrl,
  };
  ctaCell.font = { size: 14, bold: true, color: { argb: "FF1D4ED8" } };
  ctaCell.alignment = { vertical: "middle", horizontal: "center" };
  summarySheet.getRow(3).height = 24;

  // Internal link to the raw Data tab so users who miss the tabs can still find it.
  summarySheet.mergeCells("A5:B5");
  const dataLinkCell = summarySheet.getCell("A5");
  dataLinkCell.value = {
    text: "See full list of issues in the Data tab",
    hyperlink: "#'Data'!A1",
  };
  dataLinkCell.font = { size: 12, bold: true, color: { argb: "FF0F766E" } };
  dataLinkCell.alignment = { vertical: "middle", horizontal: "center" };
  summarySheet.getRow(5).height = 18;

  const rows = [
    [
      "Audit Grade",
      `${Math.round(report.summary.overallScore)} / 100 (${
        report.summary.overallGrade
      })`,
    ],
    ["Audit Label", report.summary.overallLabel],
    ["Store Name", storeName || ""],
    ["Store URL", storeUrl],
    ["Audit Date", dateString],
    ["Total Products Audited", report.summary.totalProducts],
    ["Total Issues (sum of counts)", report.summary.totalIssues],
  ];

  for (const [label, value] of rows) {
    const row = summarySheet.addRow({ label, value });
    row.getCell("A").font = { bold: true };
  }

  summarySheet.getColumn("A").alignment = {
    vertical: "top",
    horizontal: "left",
    wrapText: true,
  };
  summarySheet.getColumn("B").alignment = {
    vertical: "top",
    horizontal: "left",
    wrapText: true,
  };

  // Add subtle borders and banded styling to the summary table.
  const firstSummaryDataRow = 6;
  const lastSummaryDataRow = summarySheet.lastRow.number;
  for (
    let rowIndex = firstSummaryDataRow;
    rowIndex <= lastSummaryDataRow;
    rowIndex++
  ) {
    const row = summarySheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
      if (rowIndex % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });
  }

  // --- Data sheet ---
  const dataSheet = workbook.addWorksheet("Data");
  dataSheet.columns = [
    { header: "Section ID", key: "sectionId", width: 15 },
    { header: "Section Title", key: "sectionTitle", width: 25 },
    { header: "Issue ID", key: "issueId", width: 18 },
    { header: "Issue", key: "issueLabel", width: 30 },
    { header: "Severity", key: "severity", width: 12 },
    { header: "Description", key: "description", width: 50 },
    { header: "Instance Type", key: "instanceType", width: 18 },
    { header: "Instance Detail", key: "instanceDetail", width: 50 },
    { header: "Product Link", key: "productLink", width: 25 },
    { header: "Variant Link", key: "variantLink", width: 25 },
    { header: "Recommendation", key: "recommendation", width: 60 },
  ];

  const dataRows = buildDataRows(report, myshopifyDomain, storeUrl);
  for (const row of dataRows) {
    const excelRow = dataSheet.addRow(row);

    // Add hyperlinks for product and variant links
    const productLinkCell = excelRow.getCell("productLink");
    if (row.productLink) {
      productLinkCell.value = {
        text: "View Product",
        hyperlink: row.productLink,
      };
      productLinkCell.font = { color: { argb: "FF1D4ED8" }, underline: true };
    }

    const variantLinkCell = excelRow.getCell("variantLink");
    if (row.variantLink) {
      variantLinkCell.value = {
        text: "View Variant",
        hyperlink: row.variantLink,
      };
      variantLinkCell.font = { color: { argb: "FF1D4ED8" }, underline: true };
    }
  }

  // Header styling.
  const headerRow = dataSheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF111827" },
  };

  for (const col of dataSheet.columns) {
    col.alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
  }

  // Freeze the header row and enable filters for easy analysis.
  dataSheet.views = [{ state: "frozen", ySplit: 1 }];
  dataSheet.autoFilter = {
    from: "A1",
    to: "K1",
  };

  // Add borders and light banding to improve readability.
  const lastDataRow = dataSheet.lastRow.number;
  for (let rowIndex = 1; rowIndex <= lastDataRow; rowIndex++) {
    const row = dataSheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };

      if (rowIndex > 1 && rowIndex % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
