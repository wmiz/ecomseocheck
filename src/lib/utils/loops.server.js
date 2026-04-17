import { env } from "$env/dynamic/private";

const LOOPS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

function severityWeight(severity) {
  if (severity === "critical") return 1.0;
  if (severity === "warning") return 0.7;
  return 0.4;
}

/**
 * Flatten a catalog audit report into a comma-separated list of the top
 * issue labels, ranked by severity weight × count.
 * @param {{ sections?: Array<{ issues?: Array<{ label?: string, severity?: string, count?: number }> }> }} report
 * @param {number} limit
 */
export function buildTopIssuesString(report, limit = 5) {
  const sections = Array.isArray(report?.sections) ? report.sections : [];
  const all = [];
  for (const section of sections) {
    const issues = Array.isArray(section?.issues) ? section.issues : [];
    for (const issue of issues) {
      if (!issue?.label || !issue?.count) continue;
      all.push({
        label: issue.label,
        score: severityWeight(issue.severity || "info") * issue.count,
      });
    }
  }
  all.sort((a, b) => b.score - a.score);
  return all
    .slice(0, limit)
    .map((i) => i.label)
    .join(", ");
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
 * @param {string} [params.topIssues]
 */
export async function syncAuditLeadToLoops({
  email,
  storeUrl,
  storeName,
  score,
  topIssues,
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
    topIssues: topIssues || "",
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
