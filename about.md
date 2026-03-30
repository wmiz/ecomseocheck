# About this project

**eComSEOCheck** is a web app that helps Shopify merchants understand how healthy their product catalog is for search and conversion. Visitors paste a store URL and receive a **free catalog health report** in about a minute, without logging into Shopify or installing an app.

## What it does

The tool analyzes the store’s **public product feed** (`/products.json`) and surfaces issues such as weak or missing SEO fields, thin descriptions, data problems, and opportunities to improve how products show up in search and on the storefront. The homepage positions the product around fixing “invisible” products: listings that are hard for Google to surface and hard for shoppers to trust.

## Free audit vs. paid work

- **Free audit:** Driven entirely from publicly available product data; results include scoring, issue breakdowns, and guidance (including deep links into Shopify admin where relevant).
- **Paid services:** The site also supports follow-on flows (for example contact, success after purchase, and guarantee content) for hands-on catalog cleanup and related services operated under **Misback Consulting**.

## How it’s built

The site is a **SvelteKit** application with **Tailwind CSS** for styling. Server-side pieces include **Supabase** for storing audit request metadata, **Resend** for transactional email where applicable, **Google reCAPTCHA v3** on sensitive forms, and tooling such as **ExcelJS** for export/report workflows.

---

This file is a high-level overview of the product and codebase purpose, not a substitute for deployment or environment setup (see `README.md` for configuration details).
