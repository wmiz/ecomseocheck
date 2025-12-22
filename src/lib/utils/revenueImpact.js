/**
 * Very rough, directional mapping from catalog audit health to a
 * potential percentage uplift range in revenue/sales.
 *
 * This is intentionally conservative and should ALWAYS be paired with
 * strong copy disclaimers in the UI. It is not a forecast.
 *
 * @param {Object} params
 * @param {number | null | undefined} params.overallScore - 0–100 catalog health score
 * @param {number | null | undefined} params.totalIssues - total issue count across checks
 * @returns {{ minPercent: number, maxPercent: number, bucket: 'light' | 'moderate' | 'heavy' } | null}
 */
export function computeRevenueUpliftRange({ overallScore, totalIssues }) {
  const score =
    typeof overallScore === "number"
      ? Math.max(0, Math.min(100, overallScore))
      : null;

  const issues =
    typeof totalIssues === "number" && totalIssues >= 0 ? totalIssues : null;

  if (score == null && issues == null) {
    return null;
  }

  // Start from the health score as the primary driver.
  // Lower scores imply more headroom for improvement.
  let bucket = "light";
  let minPercent = 0.01;
  let maxPercent = 0.03;

  if (score != null) {
    if (score >= 85) {
      // Strong catalog, some incremental upside.
      bucket = "light";
      minPercent = 0.01;
      maxPercent = 0.03;
    } else if (score >= 70) {
      // Mixed health, more meaningful but still conservative upside.
      bucket = "moderate";
      minPercent = 0.02;
      maxPercent = 0.05;
    } else {
      // Below 70: many issues – we assume more upside if fixes are implemented.
      bucket = "heavy";
      minPercent = 0.05;
      maxPercent = 0.10;
    }
  }

  // Nudge ranges slightly based on absolute issue volume, but keep within guardrails.
  if (issues != null) {
    if (issues <= 5) {
      // Very few issues – tilt towards the low end.
      maxPercent = Math.max(minPercent + 0.01, maxPercent - 0.01);
    } else if (issues >= 50) {
      // Lots of issues – small bump while staying conservative.
      minPercent = minPercent + 0.005;
      maxPercent = Math.min(maxPercent + 0.02, 0.12);
    }
  }

  return {
    minPercent,
    maxPercent,
    bucket,
  };
}









