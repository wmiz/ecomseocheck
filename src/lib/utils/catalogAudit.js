// Utility functions for analyzing a Shopify product catalog returned from /products.json

/**
 * Strip HTML tags and collapse whitespace.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Count words in a string.
 * @param {string} text
 * @returns {number}
 */
function wordCount(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/);
  return words.filter(Boolean).length;
}

/**
 * Normalize a vendor string for grouping.
 * @param {string} vendor
 * @returns {string}
 */
function normalizeVendor(vendor) {
  if (!vendor) return "";
  return vendor
    .toLowerCase()
    .replace(/\b(inc\.?|ltd\.?|corp\.?|co\.?)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Normalize a tag for grouping.
 * @param {string} tag
 * @returns {string}
 */
function normalizeTag(tag) {
  if (!tag) return "";
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Safely get tags as an array.
 * Shopify often returns comma-separated string.
 * @param {any} rawTags
 * @returns {string[]}
 */
function getTagArray(rawTags) {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags
      .map((t) => (t || "").toString())
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return rawTags
    .toString()
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Extract a lightweight product reference for examples.
 * @param {any} product
 */
function productRef(product) {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
  };
}

/**
 * Missing Image Alt Text
 */
export function findMissingImageAlt(products) {
  const results = [];

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    const primaryImage = product.image ? [product.image] : [];
    const allImages = [...primaryImage, ...images];

    const missing = allImages.filter((img) => {
      const alt = img && typeof img.alt === "string" ? img.alt : img?.alt_text;
      return !alt || alt.trim().length === 0;
    });

    if (missing.length > 0) {
      results.push({
        product: productRef(product),
        missingCount: missing.length,
      });
    }
  }

  const totalProducts = products.length || 1;
  const count = results.length;

  return {
    id: "missing_image_alt",
    label: "Missing Image Alt Text",
    description:
      "Many product images are missing alt text, which hurts accessibility and SEO. Adding descriptive alt text helps Google understand your products and improves screen-reader experiences.",
    severity: "critical",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of impacted products for exports / detailed views.
    instances: results,
    // Truncated sample for UI display.
    examples: results.slice(0, 5).map((r) => r.product),
  };
}

/**
 * Product Description Length (Thin Content)
 */
export function findThinDescriptions(products, minWords = 50) {
  const thin = [];
  const empty = [];

  for (const product of products) {
    const text = stripHtml(product.body_html || "");
    const words = wordCount(text);

    if (words === 0) {
      empty.push({ product: productRef(product), words });
    } else if (words < minWords) {
      thin.push({ product: productRef(product), words });
    }
  }

  const totalProducts = products.length || 1;
  const count = thin.length + empty.length;

  const all = [...empty, ...thin];

  return {
    id: "thin_descriptions",
    label: "Thin or Missing Product Descriptions",
    description:
      "Products with short or empty descriptions are unlikely to rank well and don't give shoppers enough information to buy confidently.",
    severity: "critical",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of impacted products.
    instances: all,
    // Truncated sample for UI display.
    examples: all.slice(0, 5).map((x) => ({
      ...x.product,
      words: x.words,
    })),
  };
}

/**
 * Duplicate Product Detection
 */
export function findDuplicateProducts(products) {
  const map = new Map();

  for (const product of products) {
    const normalizedTitle = (product.title || "")
      .toString()
      .toLowerCase()
      .trim();
    const desc = stripHtml(product.body_html || "").toLowerCase();
    const key = `${normalizedTitle}||${desc}`;

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(product);
  }

  const clusters = [];
  for (const group of map.values()) {
    if (group.length > 1) {
      clusters.push(group.map((p) => productRef(p)));
    }
  }

  const totalProducts = products.length || 1;
  const count = clusters.length;

  return {
    id: "duplicate_products",
    label: "Potential Duplicate Products",
    description:
      "Multiple products share the same title and description. This can cannibalize SEO performance and confuse shoppers.",
    severity: "warning",
    count,
    percentage: (count / totalProducts) * 100,
    // Full duplicate clusters (each cluster is an array of product refs).
    instances: clusters,
    // Truncated clusters for UI display.
    examples: clusters.slice(0, 3).map((cluster) => cluster),
  };
}

/**
 * SEO Title Truncation
 */
export function findTitleLengthIssues(products, { min = 10, max = 70 } = {}) {
  const issues = [];

  for (const product of products) {
    const title = (product.title || "").toString();
    const length = title.length;

    if (length < min || length > max) {
      issues.push({
        product: productRef(product),
        length,
      });
    }
  }

  const totalProducts = products.length || 1;
  const count = issues.length;

  return {
    id: "title_length",
    label: "SEO Title Length Issues",
    description:
      "Some product titles are so short that they're vague, or so long that they're likely to be truncated in Google search results.",
    severity: "warning",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of all title-length issues.
    instances: issues,
    // Truncated sample for UI display.
    examples: issues.slice(0, 5).map((x) => ({
      ...x.product,
      length: x.length,
    })),
  };
}

/**
 * Missing Images
 */
export function findProductsWithoutImages(products) {
  const flagged = [];

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    const primary = product.image;
    if ((!images || images.length === 0) && !primary) {
      flagged.push(productRef(product));
    }
  }

  const totalProducts = products.length || 1;
  const count = flagged.length;

  return {
    id: "missing_images",
    label: "Products Without Images",
    description:
      "Some products have no images at all. Products without imagery rarely sell and can look like site errors.",
    severity: "critical",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of products without images.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Pricing Logic (Sale Check)
 */
export function findPricingAnomalies(products) {
  const flagged = [];

  for (const product of products) {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    for (const variant of variants) {
      const price = Number(variant.price);
      const compare = variant.compare_at_price
        ? Number(variant.compare_at_price)
        : NaN;

      if (!Number.isNaN(compare) && !Number.isNaN(price)) {
        if (compare <= price) {
          flagged.push({
            product: productRef(product),
            variantId: variant.id,
            price,
            compare_at_price: compare,
          });
        }
      }
    }
  }

  const totalVariants = flagged.length || 1;
  const count = flagged.length;

  return {
    id: "pricing_anomalies",
    label: "Suspicious Sale Pricing",
    description:
      "Some variants show sale pricing where the 'compare at' price is not actually higher than the sale price, which can confuse customers and risk compliance issues.",
    severity: "warning",
    count,
    percentage: count, // treat as raw variant count; UI should present as absolute
    // Full list of pricing anomalies.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Variant Completeness (heuristic)
 */
export function findVariantCompletenessIssues(products) {
  const flagged = [];

  for (const product of products) {
    const options = Array.isArray(product.options) ? product.options : [];
    const variants = Array.isArray(product.variants) ? product.variants : [];

    if (options.length === 0 || variants.length === 0) continue;

    const optionValues = options.map((opt) => {
      const name = (opt.name || "").toLowerCase();
      const values = Array.isArray(opt.values) ? opt.values : [];
      return {
        name,
        values: [...new Set(values.map((v) => (v || "").toString().trim()))],
      };
    });

    const theoreticalMax = optionValues.reduce(
      (acc, opt) => acc * Math.max(opt.values.length || 1, 1),
      1
    );

    let missingInventoryMeta = 0;
    for (const variant of variants) {
      if (
        variant.inventory_policy == null ||
        variant.inventory_management == null ||
        typeof variant.inventory_quantity !== "number"
      ) {
        missingInventoryMeta += 1;
      }
    }

    if (variants.length < theoreticalMax || missingInventoryMeta > 0) {
      flagged.push({
        product: productRef(product),
        options: optionValues,
        variantsCount: variants.length,
        theoreticalMax,
        missingInventoryMeta,
      });
    }
  }

  const totalProducts = products.length || 1;
  const count = flagged.length;

  return {
    id: "variant_completeness",
    label: "Variant Completeness & Inventory Metadata",
    description:
      "Some products are missing expected variant combinations or have incomplete inventory settings, which can lead to broken options or overselling.",
    severity: "info",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of products with variant completeness issues.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Missing SKUs
 */
export function findMissingSkus(products) {
  const flagged = [];
  let totalVariants = 0;

  for (const product of products) {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    for (const variant of variants) {
      totalVariants += 1;
      const sku = (variant.sku || "").toString();
      if (!sku.trim()) {
        flagged.push({
          product: productRef(product),
          variantId: variant.id,
        });
      }
    }
  }

  const count = flagged.length;
  const denominator = totalVariants || 1;

  return {
    id: "missing_skus",
    label: "Missing SKUs",
    description:
      "Variants without SKUs make it difficult to integrate with 3PLs, ERPs, and inventory systems.",
    severity: "critical",
    count,
    percentage: (count / denominator) * 100,
    // Full list of variants missing SKUs.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Missing Weights (Shipping Risk)
 */
export function findMissingWeights(products) {
  const flagged = [];
  let totalShippable = 0;

  for (const product of products) {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    for (const variant of variants) {
      const requiresShipping =
        variant.requires_shipping !== false &&
        product.requires_shipping !== false;

      if (requiresShipping) {
        totalShippable++;
        const grams = typeof variant.grams === "number" ? variant.grams : 0;

        if (!grams || grams === 0) {
          flagged.push({
            product: productRef(product),
            variantId: variant.id,
          });
        }
      }
    }
  }

  const count = flagged.length;
  const totalShippableVariants = totalShippable || 1;

  return {
    id: "missing_weights",
    label: "Missing Weights on Shippable Variants",
    description:
      "Some shippable variants have no weight set, which can break calculated shipping rates and eat into your margins.",
    severity: "warning",
    count,
    percentage: (count / totalShippableVariants) * 100,
    // Full list of variants missing weights.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Vendor Fragmentation
 */
export function analyzeVendors(products) {
  const map = new Map();

  for (const product of products) {
    const vendor = (product.vendor || "").toString().trim();
    if (!vendor) continue;
    const norm = normalizeVendor(vendor);
    if (!norm) continue;

    if (!map.has(norm)) {
      map.set(norm, new Set());
    }
    map.get(norm).add(vendor);
  }

  const fragmented = [];
  for (const [norm, variants] of map.entries()) {
    if (variants.size > 1) {
      fragmented.push({
        normalized: norm,
        variants: Array.from(variants),
      });
    }
  }

  const totalGroups = map.size || 1;
  const count = fragmented.length;

  return {
    id: "vendor_fragmentation",
    label: "Vendor Name Fragmentation",
    description:
      "Similar vendors are spelled multiple ways, which fragments reporting and collection filtering.",
    severity: "info",
    count,
    percentage: (count / totalGroups) * 100,
    // Full fragmented vendor groups.
    instances: fragmented,
    // Truncated sample for UI display.
    examples: fragmented.slice(0, 5),
  };
}

/**
 * Tag "Soup" Analysis
 */
export function analyzeTags(products) {
  const counts = new Map();

  for (const product of products) {
    const tags = getTagArray(product.tags);
    for (const tag of tags) {
      if (!tag) continue;

      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  const singleUse = [];
  for (const [tag, count] of counts.entries()) {
    if (count === 1) {
      singleUse.push({ tag, count });
    }
  }

  const totalTags = counts.size || 1;
  const count = singleUse.length;

  return {
    id: "tag_soup",
    label: "Tag Soup",
    description:
      "Many tags are only used once, which makes filtering and reporting noisy.",
    severity: "info",
    count,
    percentage: (count / totalTags) * 100,
    // Full tag data for detailed exports.
    instances: {
      singleUse,
    },
    examples: {
      singleUse: singleUse.slice(0, 10),
    },
  };
}

/**
 * Orphaned Products
 */
export function findOrphanedProducts(products, recentDays = 60) {
  const flagged = [];
  const now = new Date();
  const cutoffMs = recentDays * 24 * 60 * 60 * 1000;

  for (const product of products) {
    const publishedAt = product.published_at
      ? new Date(product.published_at)
      : null;
    const updatedAt = product.updated_at ? new Date(product.updated_at) : null;

    if (!updatedAt || Number.isNaN(updatedAt.getTime())) continue;

    const isRecent = now.getTime() - updatedAt.getTime() <= cutoffMs;
    const isHidden =
      !publishedAt ||
      Number.isNaN(publishedAt.getTime()) ||
      product.published_at === null;

    if (isRecent && isHidden) {
      flagged.push({
        product: productRef(product),
        updated_at: product.updated_at,
      });
    }
  }

  const totalProducts = products.length || 1;
  const count = flagged.length;

  return {
    id: "orphaned_products",
    label: "Recently Updated but Hidden Products",
    description:
      "Some products have been updated recently but are not published. These may be missed launch opportunities.",
    severity: "info",
    count,
    percentage: (count / totalProducts) * 100,
    // Full list of orphaned products.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Image Optimization Audit
 */
export function analyzeImageSizes(products, maxDimension = 2000) {
  const flagged = [];
  let totalImages = 0;

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    totalImages += images.length;
    for (const image of images) {
      const width = typeof image.width === "number" ? image.width : 0;
      const height = typeof image.height === "number" ? image.height : 0;
      if (width > maxDimension || height > maxDimension) {
        flagged.push({
          product: productRef(product),
          width,
          height,
        });
      }
    }
  }

  const count = flagged.length;
  const denominator = totalImages || 1;

  return {
    id: "large_images",
    label: "Large Product Images",
    description:
      "Some product images are very large. While Shopify compresses images, oversized uploads can still indicate an inefficient asset pipeline.",
    severity: "info",
    count,
    percentage: (count / denominator) * 100,
    // Full list of large images.
    instances: flagged,
    // Truncated sample for UI display.
    examples: flagged.slice(0, 5),
  };
}

/**
 * Compute an overall catalog health score and letter grade
 * based on the mix of issues and their severities.
 */
function computeOverallGrade(sections) {
  const allIssues = sections.flatMap((section) => section.issues || []);

  if (allIssues.length === 0) {
    return {
      score: 100,
      grade: "A",
      label: "Excellent catalog health.",
    };
  }

  function severityWeight(severity) {
    if (severity === "critical") return 1.0;
    if (severity === "warning") return 0.7;
    return 0.4; // info / default
  }

  let totalImpact = 0;

  for (const issue of allIssues) {
    const weight = severityWeight(issue.severity || "info");
    const pct =
      typeof issue.percentage === "number"
        ? Math.max(0, Math.min(issue.percentage, 100))
        : 50;
    totalImpact += weight * pct;
  }

  const avgImpact = totalImpact / allIssues.length;
  const score = Math.max(0, Math.min(100, 100 - avgImpact));

  let grade = "C";
  let label =
    "Mixed catalog health – several important issues to address for better performance.";

  if (score >= 90) {
    grade = "A";
    label = "Excellent catalog health – only minor optimizations needed.";
  } else if (score >= 80) {
    grade = "B";
    label = "Strong catalog health with room for improvement.";
  } else if (score >= 70) {
    grade = "C";
    label =
      "Mixed catalog health – several important issues to address for better performance.";
  } else if (score >= 60) {
    grade = "D";
    label =
      "At-risk catalog health – many issues may be holding back performance.";
  } else {
    grade = "F";
    label =
      "Critical catalog health – urgent cleanup is recommended to avoid lost revenue.";
  }

  return { score, grade, label };
}

/**
 * Yield control to the event loop to prevent blocking.
 * This allows other operations to run while processing large datasets.
 */
function yieldToEventLoop() {
  return new Promise((resolve) => {
    // Use setImmediate for Node.js to yield to the event loop
    if (typeof setImmediate !== "undefined") {
      setImmediate(resolve);
    } else {
      // Fallback for environments without setImmediate
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Run all checks and build a structured report object for the UI.
 * This version processes checks asynchronously to prevent blocking the event loop.
 * @param {any[]} products
 */
export async function runCatalogAudit(products) {
  const totalProducts = products.length;

  // For very large catalogs, yield more frequently to keep the server responsive
  const isLargeCatalog = totalProducts > 1000;

  // Process checks in batches, yielding control between each batch
  // to prevent blocking the event loop for large catalogs

  // SEO checks
  await yieldToEventLoop();
  const seoIssues = [
    findMissingImageAlt(products),
    findThinDescriptions(products),
    findDuplicateProducts(products),
    findTitleLengthIssues(products),
  ];
  if (isLargeCatalog) await yieldToEventLoop();

  // UX checks
  await yieldToEventLoop();
  const uxIssues = [
    findProductsWithoutImages(products),
    findPricingAnomalies(products),
    findVariantCompletenessIssues(products),
    findOrphanedProducts(products),
    analyzeImageSizes(products),
  ];
  if (isLargeCatalog) await yieldToEventLoop();

  // Data checks
  await yieldToEventLoop();
  const dataIssues = [
    findMissingSkus(products),
    findMissingWeights(products),
    analyzeVendors(products),
    analyzeTags(products),
  ];

  const sections = [
    {
      id: "seo",
      title: "SEO Health",
      issues: seoIssues,
    },
    {
      id: "ux",
      title: "Conversion & UX",
      issues: uxIssues,
    },
    {
      id: "data",
      title: "Operational & Data Integrity",
      issues: dataIssues,
    },
  ];

  const overall = computeOverallGrade(sections);

  const summary = {
    totalProducts,
    totalIssues: sections.reduce(
      (acc, section) =>
        acc +
        section.issues.reduce(
          (innerAcc, issue) => innerAcc + (issue.count || 0),
          0
        ),
      0
    ),
    overallScore: overall.score,
    overallGrade: overall.grade,
    overallLabel: overall.label,
  };

  return {
    summary,
    sections,
  };
}
