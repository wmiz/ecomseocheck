/**
 * Generate XML sitemap for the site
 */
export async function GET({ url }) {
  const baseUrl =
    import.meta.env.PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;

  // Define all public routes with their priorities and change frequencies
  const routes = [
    {
      path: "/",
      priority: "1.0",
      changefreq: "weekly",
      lastmod: new Date().toISOString().split("T")[0]
    },
    {
      path: "/contact",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: new Date().toISOString().split("T")[0]
    },
    {
      path: "/guarantee",
      priority: "0.7",
      changefreq: "monthly",
      lastmod: new Date().toISOString().split("T")[0]
    },
    {
      path: "/changelog",
      priority: "0.6",
      changefreq: "weekly",
      lastmod: new Date().toISOString().split("T")[0]
    }
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}

