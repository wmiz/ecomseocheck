import { fail } from "@sveltejs/kit";
import { runCatalogAudit } from "$lib/utils/catalogAudit.js";
import { computeRevenueUpliftRange } from "$lib/utils/revenueImpact.js";

/**
 * Normalize and validate a store URL string.
 * Ensures protocol is present and trims trailing slashes.
 * Returns { ok: true, storeUrl, normalizedBase } on success,
 * or { ok: false, error } on failure.
 * @param {string} raw
 */
function normalizeStoreUrl(raw) {
  const value = (raw || "").toString().trim();

  if (!value) {
    return {
      ok: false,
      error: "Store URL is required.",
    };
  }

  let storeUrl = value;
  // If the user didn't include a protocol, assume HTTPS.
  if (!/^https?:\/\//i.test(storeUrl)) {
    storeUrl = `https://${storeUrl}`;
  }

  const normalizedBase = storeUrl.replace(/\/+$/, "");

  return {
    ok: true,
    storeUrl,
    normalizedBase,
  };
}

/**
 * Fetch all products from the public /products.json endpoint, handling
 * pagination for stores with more than 250 products.
 *
 * Shopify's legacy storefront endpoint supports page-based pagination via
 * `?limit=250&page=2`. We keep a conservative upper bound on pages to avoid
 * accidentally hammering a store with infinite requests.
 *
 * @param {Object} params
 * @param {string} params.normalizedBase - Base store URL with protocol, no trailing slash.
 * @param {Function} params.fetch - The SvelteKit fetch implementation from the event.
 */
async function fetchAllProducts({ normalizedBase, fetch }) {
  const limit = 250;
  const maxPages = 40; // up to ~10,000 products; adjust if needed
  const allProducts = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${normalizedBase}/products.json?limit=${limit}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Failed to fetch products.json",
        response.status,
        response.statusText,
        { url }
      );
      return {
        ok: false,
        status: response.status,
        error:
          "We couldn't access /products.json for that store. Please confirm the URL and that the store is public.",
        products: [],
      };
    }

    const json = await response.json();
    const pageProducts = Array.isArray(json?.products) ? json.products : [];
    allProducts.push(...pageProducts);

    // If we received fewer than the limit, we've reached the last page.
    if (pageProducts.length < limit) {
      break;
    }
  }

  return {
    ok: true,
    status: 200,
    products: allProducts,
  };
}

/**
 * Fetch products and basic store metadata, then run the catalog audit.
 * This is used both by the audit page action and the export endpoint.
 *
 * @param {Object} params
 * @param {string} params.storeUrl - User-provided store URL (may be missing protocol).
 * @param {Function} params.fetch - The SvelteKit fetch implementation from the event.
 */
export async function _buildCatalogAuditResult({ storeUrl, fetch }) {
  const normalized = normalizeStoreUrl(storeUrl);

  if (!normalized.ok) {
    return {
      ok: false,
      status: 400,
      error: normalized.error,
      storeUrl: (storeUrl || "").toString().trim(),
    };
  }

  const { storeUrl: finalStoreUrl, normalizedBase } = normalized;
  const metaUrl = `${normalizedBase}/meta.json`;

  try {
    // Artificial delay: simulating connection time
    await new Promise((resolve) => setTimeout(resolve, 800));

    const productsResult = await fetchAllProducts({ normalizedBase, fetch });

    if (!productsResult.ok) {
      return {
        ok: false,
        status: productsResult.status,
        error: productsResult.error,
        storeUrl: finalStoreUrl,
      };
    }

    const products = productsResult.products;

    // Artificial delay: simulating data processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (products.length === 0) {
      return {
        ok: true,
        status: 200,
        storeUrl: finalStoreUrl,
        storeName: null,
        myshopifyDomain: null,
        info: "No products were returned from /products.json. Add products or ensure they are published, then try again.",
        report: null,
        uplift: null,
      };
    }

    let storeName = null;
    let myshopifyDomain = null;
    try {
      const metaResponse = await fetch(metaUrl);
      if (metaResponse.ok) {
        const meta = await metaResponse.json();
        storeName =
          meta?.shop?.name ||
          meta?.name ||
          meta?.shop_name ||
          meta?.store_name ||
          null;
        myshopifyDomain = meta?.myshopify_domain || null;
      }
    } catch (e) {
      console.warn("Unable to fetch meta.json for store", e);
    }

    // Artificial delay: simulating analysis time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const report = await runCatalogAudit(products);

    // Artificial delay: simulating report generation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const uplift = computeRevenueUpliftRange({
      overallScore: report?.summary?.overallScore,
      totalIssues: report?.summary?.totalIssues,
    });

    // Artificial delay: final processing
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      ok: true,
      status: 200,
      storeUrl: finalStoreUrl,
      storeName,
      myshopifyDomain,
      report,
      uplift,
    };
  } catch (error) {
    console.error("Error fetching products.json", error);

    return {
      ok: false,
      status: 500,
      error:
        "Something went wrong reaching /products.json. Double-check the store URL or try again in a few minutes.",
      storeUrl: finalStoreUrl,
    };
  }
}

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const rawStoreUrl = (data.get("storeUrl") || "").toString().trim();

    const result = await _buildCatalogAuditResult({
      storeUrl: rawStoreUrl,
      fetch,
    });

    if (!result.ok) {
      return fail(result.status || 400, {
        error: result.error,
        storeUrl: result.storeUrl,
      });
    }

    // If we got a successful response but no products, surface the info message.
    if (!result.report) {
      return {
        storeUrl: result.storeUrl,
        storeName: result.storeName ?? null,
        report: null,
        info: result.info,
        uplift: null,
      };
    }

    return {
      storeUrl: result.storeUrl,
      storeName: result.storeName ?? null,
      report: result.report,
      uplift: result.uplift ?? null,
    };
  },
};
