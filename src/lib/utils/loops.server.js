import { env } from "$env/dynamic/private";

const LOOPS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

function severityWeight(severity) {
  if (severity === "critical") return 1.0;
  if (severity === "warning") return 0.7;
  return 0.4;
}

const ISSUE_COPY = {
  missing_image_alt:
    "Missing alt text means Google can't index your product images.",
  thin_descriptions:
    "Thin descriptions mean your products aren't showing up in search results.",
  duplicate_products:
    "Duplicate products compete with themselves in search and split your ranking signals.",
  title_length:
    "Product titles that are too short or too long get truncated in results and hurt click-through.",
  missing_images:
    "Products without images don't convert — shoppers skip past them.",
  pricing_anomalies:
    "Pricing outliers signal data errors that break faceted search and category filters.",
  variant_completeness:
    "Variant metadata gaps can break your inventory sync and confuse shoppers.",
  missing_skus:
    "Missing SKUs break inventory tracking, reporting, and third-party integrations.",
  missing_weights:
    "Missing product weights produce wrong shipping rates at checkout and drive cart abandonment.",
  vendor_fragmentation:
    "Inconsistent vendor names fragment your brand pages and split SEO authority.",
  tag_soup:
    "Tag sprawl clutters navigation and dilutes the collections Google wants to rank.",
  orphaned_products:
    "Orphaned products sit outside any collection — they get no internal traffic or link equity.",
  large_images:
    "Oversized product images slow page load, hurt Core Web Vitals, and tank mobile conversions.",
};

/**
 * Flatten a catalog audit report into the top N issues by severity × count.
 * @param {{ sections?: Array<{ issues?: Array<{ id?: string, label?: string, severity?: string, count?: number }> }> }} report
 * @param {number} limit
 */
function rankTopIssues(report, limit) {
  const sections = Array.isArray(report?.sections) ? report.sections : [];
  const all = [];
  for (const section of sections) {
    const issues = Array.isArray(section?.issues) ? section.issues : [];
    for (const issue of issues) {
      if (!issue?.label || !issue?.count) continue;
      all.push({
        id: issue.id,
        label: issue.label,
        score: severityWeight(issue.severity || "info") * issue.count,
      });
    }
  }
  all.sort((a, b) => b.score - a.score);
  return all.slice(0, limit);
}

/**
 * Build a full "top issues" copy block suitable for pasting into a Loops
 * email via a single {{topIssues}} variable. Returns empty string if no
 * ranked issues are found.
 * @param {any} report
 * @param {number} limit
 */
export function buildTopIssuesCopy(report, limit = 3) {
  const top = rankTopIssues(report, limit);
  if (top.length === 0) return "";

  const listSentence = `The biggest ones: ${top.map((i) => i.label).join(", ")}.`;
  const explanations = top
    .map((i) => ISSUE_COPY[i.id])
    .filter(Boolean)
    .join(" ");

  return explanations ? `${listSentence}\n\n${explanations}` : listSentence;
}

/**
 * Upsert a contact into Loops and subscribe them to the audit mailing list.
 * Uses PUT /contacts/update which creates the contact if it doesn't exist.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} [params.storeUrl]
 * @param {string|null} [params.storeName]
 * @param {number} [params.score]
 * @param {number} [params.totalIssues]
 * @param {string} [params.topIssues]
 * @param {string|null} [params.auditFileUrl]
 */
export async function syncAuditLeadToLoops({
  email,
  storeUrl,
  storeName,
  score,
  totalIssues,
  topIssues,
  auditFileUrl,
}) {
  const apiKey = env.LOOPS_API_KEY;
  const listId = env.LOOPS_AUDIT_LIST_ID;

  if (!apiKey || !listId) {
    throw new Error(
      "Missing LOOPS_API_KEY or LOOPS_AUDIT_LIST_ID environment variable."
    );
  }

  const body = {
    email,
    userId: email,
    userGroup: "Audit Download",
    storeUrl: storeUrl || "",
    storeName: storeName || "",
    score: typeof score === "number" ? score : null,
    totalIssues: typeof totalIssues === "number" ? totalIssues : null,
    topIssues: topIssues || "",
    auditFileUrl: auditFileUrl || "",
    mailingLists: { [listId]: true },
  };

  const response = await fetch(LOOPS_UPDATE_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Loops upsert failed (${response.status}): ${text || response.statusText}`
    );
  }

  return response.json().catch(() => ({}));
}
