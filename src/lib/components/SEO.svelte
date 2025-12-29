<script>
  import { page } from "$app/stores";
  import {
    generateOpenGraphTags,
    generateTwitterCardTags,
    generateCanonicalUrl,
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateServiceSchema,
    generateBreadcrumbSchema,
    generateArticleSchema
  } from "$lib/utils/seo.js";

  let {
    title,
    description,
    image = "/logo.png",
    type = "website",
    author,
    publishedTime,
    modifiedTime,
    noindex = false,
    nofollow = false,
    organizationSchema = null,
    websiteSchema = null,
    serviceSchema = null,
    breadcrumbSchema = null,
    articleSchema = null
  } = $props();

  // Get current URL for canonical and Open Graph
  const currentUrl = $derived.by(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    // For SSR, construct from page URL
    const origin = $page.url.origin || "https://example.com";
    return `${origin}${$page.url.pathname}${$page.url.search}`;
  });

  // Generate meta tags
  const ogTags = $derived(
    generateOpenGraphTags({
      title,
      description,
      image,
      url: currentUrl,
      type
    })
  );

  const twitterTags = $derived(
    generateTwitterCardTags({
      title,
      description,
      image
    })
  );

  // Generate canonical URL
  const canonicalUrl = $derived.by(() => {
    const origin = $page.url.origin || "https://example.com";
    return `${origin}${$page.url.pathname}`;
  });

  // Generate robots meta
  const robotsContent = $derived.by(() => {
    const parts = [];
    if (noindex) parts.push("noindex");
    else parts.push("index");
    if (nofollow) parts.push("nofollow");
    else parts.push("follow");
    return parts.join(", ");
  });

  // Default schemas if not provided
  const defaultOrganizationSchema = $derived(
    organizationSchema || generateOrganizationSchema()
  );
  const defaultWebsiteSchema = $derived(
    websiteSchema || (type === "website" ? generateWebSiteSchema() : null)
  );
  const defaultServiceSchema = $derived(serviceSchema || null);
  const defaultBreadcrumbSchema = $derived(breadcrumbSchema || null);
  const defaultArticleSchema = $derived(
    articleSchema ||
      (type === "article" && title
        ? generateArticleSchema({
            headline: title,
            description,
            image,
            datePublished: publishedTime,
            dateModified: modifiedTime,
            author: author
              ? {
                  "@type": "Person",
                  name: author
                }
              : undefined
          })
        : null)
  );
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  {#if title}
    <title>{title}</title>
  {/if}
  {#if description}
    <meta name="description" content={description} />
  {/if}
  <meta name="robots" content={robotsContent} />
  {#if author}
    <meta name="author" content={author} />
  {/if}

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph / Facebook -->
  {#each ogTags as tag}
    <meta property={tag.property} content={tag.content} />
  {/each}

  <!-- Twitter -->
  {#each twitterTags as tag}
    <meta name={tag.name} content={tag.content} />
  {/each}

  <!-- JSON-LD Structured Data -->
  {#if defaultOrganizationSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(
      defaultOrganizationSchema
    )}</script>`}
  {/if}

  {#if defaultWebsiteSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(
      defaultWebsiteSchema
    )}</script>`}
  {/if}

  {#if defaultServiceSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(
      defaultServiceSchema
    )}</script>`}
  {/if}

  {#if defaultBreadcrumbSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(
      defaultBreadcrumbSchema
    )}</script>`}
  {/if}

  {#if defaultArticleSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(
      defaultArticleSchema
    )}</script>`}
  {/if}
</svelte:head>

