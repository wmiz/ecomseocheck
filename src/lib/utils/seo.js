/**
 * SEO utility functions for generating meta tags, Open Graph tags, Twitter Cards, and JSON-LD structured data
 */

/**
 * Get the base URL for the site
 * @param {string} path - Optional path to append
 * @returns {string} Full URL
 */
export function getBaseUrl(path = '') {
  // In production, this should come from environment variable
  // For now, we'll construct it from the current page URL if available
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}${path}`;
  }
  // Fallback for SSR - should be set via environment variable
  // In SvelteKit, we can access env vars via import.meta.env
  let siteUrl = 'https://example.com';
  try {
    // Try to access import.meta.env (available in Vite/SvelteKit)
    if (import.meta?.env?.PUBLIC_SITE_URL) {
      siteUrl = import.meta.env.PUBLIC_SITE_URL;
    } else if (typeof process !== 'undefined' && process.env?.PUBLIC_SITE_URL) {
      siteUrl = process.env.PUBLIC_SITE_URL;
    }
  } catch {
    // Fallback if import.meta is not available
    if (typeof process !== 'undefined' && process.env?.PUBLIC_SITE_URL) {
      siteUrl = process.env.PUBLIC_SITE_URL;
    }
  }
  return `${siteUrl}${path}`;
}

/**
 * Generate Open Graph meta tags
 * @param {Object} options - SEO options
 * @returns {Array<Object>} Array of meta tag objects
 */
export function generateOpenGraphTags(options) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    siteName = 'eComSEOCheck',
    locale = 'en_US'
  } = options;

  const tags = [];

  if (title) tags.push({ property: 'og:title', content: title });
  if (description) tags.push({ property: 'og:description', content: description });
  if (type) tags.push({ property: 'og:type', content: type });
  if (url) tags.push({ property: 'og:url', content: url });
  if (siteName) tags.push({ property: 'og:site_name', content: siteName });
  if (locale) tags.push({ property: 'og:locale', content: locale });

  if (image) {
    const imageUrl = image.startsWith('http') ? image : getBaseUrl(image);
    tags.push({ property: 'og:image', content: imageUrl });
    tags.push({ property: 'og:image:alt', content: title || description || '' });
  }

  return tags;
}

/**
 * Generate Twitter Card meta tags
 * @param {Object} options - SEO options
 * @returns {Array<Object>} Array of meta tag objects
 */
export function generateTwitterCardTags(options) {
  const {
    title,
    description,
    image,
    card = 'summary_large_image',
    site = '@ecomseocheck'
  } = options;

  const tags = [];

  tags.push({ name: 'twitter:card', content: card });
  if (site) tags.push({ name: 'twitter:site', content: site });
  if (title) tags.push({ name: 'twitter:title', content: title });
  if (description) tags.push({ name: 'twitter:description', content: description });

  if (image) {
    const imageUrl = image.startsWith('http') ? image : getBaseUrl(image);
    tags.push({ name: 'twitter:image', content: imageUrl });
    tags.push({ name: 'twitter:image:alt', content: title || description || '' });
  }

  return tags;
}

/**
 * Generate Organization JSON-LD structured data
 * @param {Object} options - Organization options
 * @returns {Object} JSON-LD object
 */
export function generateOrganizationSchema(options = {}) {
  const {
    name = 'Misback Consulting',
    url = getBaseUrl(),
    logo = getBaseUrl('/logo.png'),
    description = 'Shopify SEO and catalog optimization services',
    sameAs = ['https://willmisback.com']
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo
    },
    description,
    sameAs
  };
}

/**
 * Generate WebSite JSON-LD structured data
 * @param {Object} options - WebSite options
 * @returns {Object} JSON-LD object
 */
export function generateWebSiteSchema(options = {}) {
  const {
    name = 'eComSEOCheck',
    url = getBaseUrl(),
    description = 'Free Shopify store health audit tool. Check SEO, conversion, data integrity, and hidden upsell opportunities.',
    potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?url={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction
  };
}

/**
 * Generate Service JSON-LD structured data
 * @param {Object} options - Service options
 * @returns {Object} JSON-LD object
 */
export function generateServiceSchema(options = {}) {
  const {
    name = 'Shopify Store Health Audit',
    description = 'Free Shopify product catalog health audit. Check SEO, conversion, data integrity, and hidden upsell opportunities.',
    provider = {
      '@type': 'Organization',
      name: 'Misback Consulting'
    },
    areaServed = 'Worldwide',
    serviceType = 'SEO Audit'
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider,
    areaServed,
    serviceType
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 * @param {Array<Object>} items - Breadcrumb items with name and url
 * @returns {Object} JSON-LD object
 */
export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate Article JSON-LD structured data (for blog posts, changelog entries, etc.)
 * @param {Object} options - Article options
 * @returns {Object} JSON-LD object
 */
export function generateArticleSchema(options = {}) {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author = {
      '@type': 'Organization',
      name: 'Misback Consulting'
    },
    publisher = {
      '@type': 'Organization',
      name: 'Misback Consulting',
      logo: {
        '@type': 'ImageObject',
        url: getBaseUrl('/logo.png')
      }
    }
  } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author,
    publisher
  };

  if (image) {
    schema.image = image.startsWith('http') ? image : getBaseUrl(image);
  }

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return schema;
}

/**
 * Generate canonical URL
 * @param {string} path - Path to canonicalize
 * @returns {string} Canonical URL
 */
export function generateCanonicalUrl(path = '') {
  return getBaseUrl(path);
}

