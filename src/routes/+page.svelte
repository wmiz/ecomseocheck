<script>
  import RevenueImpactCalculator from "$lib/components/RevenueImpactCalculator.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { enhance, applyAction } from "$app/forms";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import logo from "$lib/assets/logo.png";
  import { generateServiceSchema } from "$lib/utils/seo.js";

  let storeUrl = $state("");
  let storeName = $state("");
  let submitting = $state(false);
  let progress = $state(0);
  let progressMessage = $state("");

  // Download panel state
  let downloadEmail = $state("");
  let downloadConsent = $state(true);
  let downloadSubmitting = $state(false);
  let downloadProgress = $state(0);
  let downloadProgressMessage = $state("");
  let downloadError = $state("");
  let auditEmailFocused = $state(false);

  let form = $derived($page.form);
  let urlParam = $derived($page.url.searchParams.get("url") || "");
  let lastAutoSubmittedUrl = $state("");

  // Normalize URLs for comparison (remove protocol, trailing slashes, lowercase)
  function normalizeUrlForComparison(url) {
    if (!url) return "";
    let normalized = url.trim().toLowerCase();
    // Remove protocol
    normalized = normalized.replace(/^https?:\/\//i, "");
    // Remove trailing slashes
    normalized = normalized.replace(/\/+$/, "");
    return normalized;
  }

  // Build a normalized base store URL (with protocol, no trailing slash)
  const getStoreBaseUrl = () => {
    const raw = form?.storeUrl || storeUrl;
    if (!raw) return null;

    let url = raw.toString().trim();

    // Ensure protocol
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    // Remove trailing slashes
    url = url.replace(/\/+$/, "");

    return url;
  };

  // Build a direct product URL for a given handle
  const getProductUrl = (handle) => {
    if (!handle) return null;
    const base = getStoreBaseUrl();
    if (!base) return null;
    return `${base}/products/${handle}`;
  };

  // Auto-populate and submit when URL parameter is present
  $effect(() => {
    if (urlParam) {
      // Normalize the URL for the input (remove protocol if present, but keep it clean)
      let normalizedUrl = urlParam.trim();
      // Remove protocol for cleaner input
      normalizedUrl = normalizedUrl.replace(/^https?:\/\//i, "");
      // Remove trailing slashes
      normalizedUrl = normalizedUrl.replace(/\/+$/, "");

      // Prevent duplicate submissions by checking if we've already submitted this URL
      const normalizedForComparison = normalizeUrlForComparison(normalizedUrl);
      if (
        normalizedForComparison ===
        normalizeUrlForComparison(lastAutoSubmittedUrl)
      ) {
        return; // Already submitted this URL
      }

      storeUrl = normalizedUrl;
      lastAutoSubmittedUrl = normalizedUrl;

      // Wait for the DOM to update and form to be ready, then submit
      tick().then(() => {
        // Use a longer delay to ensure the form is fully initialized and reactive
        setTimeout(() => {
          const formElement = document.querySelector("[data-audit-form]");
          const inputElement = document.querySelector("#storeUrl");

          // Ensure form exists, input has the value, form is valid, and we're not already submitting
          if (
            formElement &&
            inputElement &&
            inputElement.value === normalizedUrl &&
            !submitting &&
            formElement.checkValidity()
          ) {
            // Dispatch a submit event on the form itself to trigger enhance
            // This ensures SvelteKit's form handling is properly invoked
            const submitEvent = new Event("submit", {
              bubbles: true,
              cancelable: true,
            });
            formElement.dispatchEvent(submitEvent);
          }
        }, 300);
      });
    }
  });

  const getIssueDescription = (issue) => {
    const desc = issue?.description || "";
    const hasIssues = (issue?.count || 0) > 0;

    if (hasIssues) return desc;

    if (!desc) return "";

    const first = desc.charAt(0).toLowerCase();
    return `Occurs when ${first}${desc.slice(1)}`;
  };

  const pageTitle = "Shopify Store Health Audit";
  const pageDescription =
    "Run a free Shopify product catalog health audit. Check SEO, conversion, data integrity, and hidden upsell opportunities using only your public /products.json feed.";

  // Generate service schema for homepage
  const serviceSchema = generateServiceSchema({
    name: pageTitle,
    description: pageDescription
  });

  const getGradeClasses = (value) => {
    if (value == null || value === "") {
      return "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-900";
    }

    const base =
      "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-3xl font-semibold leading-none";
    const numeric = Number(value);

    if (!Number.isNaN(numeric)) {
      const score = Math.max(0, Math.min(100, numeric));

      if (score >= 90) {
        return (
          base +
          " bg-emerald-500/15 text-emerald-700 border border-emerald-500/40"
        );
      }
      if (score >= 80) {
        return base + " bg-lime-500/15 text-lime-700 border border-lime-500/40";
      }
      if (score >= 70) {
        return (
          base + " bg-amber-500/15 text-amber-700 border border-amber-500/40"
        );
      }

      // below 70
      return base + " bg-red-500/15 text-red-700 border border-red-500/40";
    }

    // Fallback for non-numeric inputs (legacy letter grades)
    const letter = String(value).trim().charAt(0).toUpperCase();

    if (letter === "A") {
      return (
        base + " bg-[#00a979]/15 text-[#008a65] border border-[#00a979]/40"
      );
    }
    if (letter === "B") {
      return base + " bg-lime-500/15 text-lime-700 border border-lime-500/40";
    }
    if (letter === "C") {
      return (
        base + " bg-amber-500/15 text-amber-700 border border-amber-500/40"
      );
    }

    // D or below (or unknown)
    return base + " bg-red-500/15 text-red-700 border border-red-500/40";
  };
</script>

<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
  serviceSchema={serviceSchema}
/>

<main class="min-h-[80vh] flex justify-center items-start pt-15 pb-15">
  <div id="audit" class="w-full flex justify-center items-start">
    <div class="container mx-auto px-4 w-full">
      <div class="max-w-5xl mx-auto w-full">
        <div class="text-center mb-10">
          <img
            src={logo}
            alt="eComSEOCheck - Shopify Store Health Audit Tool"
            width="200"
            height="auto"
            class="mx-auto mb-2 max-w-[200px] h-auto"
          />
          <a
            href="https://willmisback.com"
            target="_blank"
            rel="noopener noreferrer"
            class="block text-sm text-[#6b7280] mb-4 hover:text-[#374151]"
          >
            by Misback Consulting
          </a>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
            Better Shopify SEO, Simplified.
          </h1>
          <p class="text-xl text-[#26363f] max-w-3xl mx-auto">
            Just enter your URL to receive a roadmap to higher rankings and more
            sales. Uncover the hidden technical errors holding your Shopify
            store back.
          </p>
        </div>

        {#if form?.error}
          <div class="bg-red-500/15 border border-red-500 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-[#26363f] mb-1">
                  We couldn't run your audit
                </h3>
                <p class="text-sm text-[#26363f]">
                  {form.error}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if form?.info}
          <div
            class="bg-blue-500/10 border border-blue-400 rounded-lg p-4 mb-6"
          >
            <p class="text-sm text-[#26363f]">
              {form.info}
            </p>
          </div>
        {/if}

        <form
          method="POST"
          action="/audit"
          data-audit-form
          use:enhance={() => {
            submitting = true;
            progress = 0;
            progressMessage = "Initializing audit...";

            // Track the timeout so we can clear it
            let progressTimeout = null;
            let isComplete = false;

            // Simulate progress while waiting for server response with uneven jumps
            let lastUpdate = Date.now();
            const updateProgress = () => {
              if (progress < 90 && !isComplete) {
                const now = Date.now();
                const timeSinceLastUpdate = now - lastUpdate;

                // Variable increment size - sometimes small, sometimes large
                let increment;
                const rand = Math.random();
                if (rand < 0.3) {
                  // 30% chance of small increment (0.5-2%)
                  increment = 0.5 + Math.random() * 1.5;
                } else if (rand < 0.7) {
                  // 40% chance of medium increment (2-5%)
                  increment = 2 + Math.random() * 3;
                } else if (rand < 0.9) {
                  // 20% chance of larger increment (5-8%)
                  increment = 5 + Math.random() * 3;
                } else {
                  // 10% chance of big jump (8-12%)
                  increment = 8 + Math.random() * 4;
                }

                progress += increment;
                if (progress > 90) progress = 90;
                lastUpdate = now;

                // Update message based on progress
                if (progress < 20) {
                  progressMessage = "Connecting to store...";
                } else if (progress < 40) {
                  progressMessage = "Fetching product data...";
                } else if (progress < 60) {
                  progressMessage = "Analyzing catalog...";
                } else if (progress < 80) {
                  progressMessage = "Running health checks...";
                } else {
                  progressMessage = "Generating report...";
                }
              }
            };

            // Variable interval timing - sometimes faster, sometimes slower
            const scheduleNext = () => {
              if (isComplete) return; // Stop scheduling if complete

              const baseDelay = 150 + Math.random() * 300; // 150-450ms
              const delay = baseDelay + (Math.random() < 0.2 ? 200 : 0); // 20% chance of extra pause
              progressTimeout = setTimeout(() => {
                updateProgress();
                if (progress < 90 && !isComplete) {
                  scheduleNext();
                }
              }, delay);
            };
            scheduleNext();

            return async ({ result }) => {
              try {
                // Use applyAction to handle the response without navigation
                // This keeps the form data on the current page so results display correctly
                if (result.type === "success" || result.type === "failure") {
                  await applyAction(result);
                }

                // Stop the progress simulation
                isComplete = true;
                if (progressTimeout) {
                  clearTimeout(progressTimeout);
                  progressTimeout = null;
                }

                // Ensure progress is at 90% before completing
                if (progress < 90) {
                  progress = 90;
                }

                // Complete the progress bar
                progress = 100;
                progressMessage = "Complete!";

                // Wait a moment to show "Complete!" before resetting
                await new Promise((resolve) => setTimeout(resolve, 500));
              } finally {
                // Clean up
                if (progressTimeout) {
                  clearTimeout(progressTimeout);
                }
                submitting = false;
                progress = 0;
                progressMessage = "";
                isComplete = false;
              }
            };
          }}
          class="bg-white shadow rounded-lg border border-gray-200 p-6 mb-10"
        >
          <div>
            <label
              for="storeUrl"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Shopify Store URL
            </label>
            <div class="flex items-stretch">
              <input
                id="storeUrl"
                name="storeUrl"
                type="text"
                bind:value={storeUrl}
                placeholder="your-store.myshopify.com"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-l-lg text-[#26363f] placeholder-gray-500 focus:outline-none transition-all"
                required
                onfocus={(e) => {
                  // Scroll input into view on mobile when keyboard appears
                  setTimeout(() => {
                    e.target.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "nearest",
                    });
                  }, 300);
                }}
              />
              <button
                type="submit"
                class="inline-flex items-center cursor-pointer justify-center px-6 py-3 bg-[#00a979] hover:bg-[#008a65] text-white font-semibold rounded-r-lg border border-l-0 border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                disabled={submitting}
              >
                {#if submitting}
                  <span class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Running audit...
                  </span>
                {:else}
                  Audit My Store
                {/if}
              </button>
            </div>

            {#if submitting}
              <div class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-[#26363f] font-medium">
                    {progressMessage}
                  </span>
                  <span class="text-sm text-[#26363f]/80">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div
                  class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
                >
                  <div
                    class="bg-[#00a979] h-2.5 rounded-full transition-all duration-300 ease-out"
                    style="width: {progress}%"
                  ></div>
                </div>
              </div>
            {/if}
            <p class="mt-4 text-xs text-[#26363f]/80 text-left ml-[2px]">
              🔒 Safe & Secure: We only analyze public data. No password, admin
              access, or private store data is ever required.
            </p>
            <div class="mt-4 flex justify-center">
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-[#26363f]/70 border border-gray-200"
              >
                <svg
                  class="w-4 h-4 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">5,000+ Audits Completed</span>
              </span>
            </div>
          </div>
        </form>

        {#if !form?.report}
          <!-- What You Get Section (only shown before audit completes) -->
          <section class="mt-12 mb-10">
            <h2
              class="text-2xl md:text-3xl font-semibold text-center text-[#26363f] mb-8"
            >
              What You Get
            </h2>
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <!-- Technical SEO Score -->
              <div
                class="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-[#00a979]/10 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-[#00a979]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  Technical SEO Score
                </h3>
                <p class="text-sm text-[#26363f]/80">
                  Uncover hidden errors in your metadata and site structure.
                </p>
              </div>

              <!-- Conversion Optimization -->
              <div
                class="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-[#00a979]/10 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-[#00a979]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  Conversion Optimization
                </h3>
                <p class="text-sm text-[#26363f]/80">
                  Identify why customers are leaving without buying.
                </p>
              </div>

              <!-- Instant Results -->
              <div
                class="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex justify-center mb-4">
                  <div
                    class="w-12 h-12 rounded-full bg-[#00a979]/10 flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-[#00a979]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  Instant Results
                </h3>
                <p class="text-sm text-[#26363f]/80">
                  Get your full report in under 60 seconds.
                </p>
              </div>
            </div>
          </section>
        {/if}

        {#if form?.report}
          {#await Promise.resolve(form.report) then report}
            <div class="space-y-10">
              <section
                class="bg-[#ffffff] shadow rounded-lg border border-gray-200 p-8"
              >
                <div
                  class="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left gap-4 mb-4"
                >
                  <div class="w-full md:w-auto">
                    {#if form?.storeName || form?.storeUrl || storeName || storeUrl}
                      <div class="mb-4">
                        <p
                          class="text-sm md:text-base text-[#26363f] font-medium"
                        >
                          Report prepared for
                        </p>
                        <div
                          class="mt-1 text-5xl md:text-5xl font-semibold text-[#26363f] tracking-tight"
                        >
                          {form?.storeName ||
                            form?.storeUrl ||
                            storeName ||
                            storeUrl}
                        </div>
                      </div>
                    {/if}
                    <p class="text-base text-[#26363f] font-medium mb-1">
                      We scanned {report.summary.totalProducts} products and identified
                      {report.summary.totalIssues} specific improvements to boost
                      your visibility and conversion rate.
                    </p>
                    <p class="text-sm text-[#26363f]/80">
                      We analyzed your
                      <code class="px-1 py-0.5 rounded bg-gray-100"
                        >/products.json</code
                      >
                      feed and surfaced the most important catalog issues to fix.
                    </p>
                  </div>
                  {#if report.summary.overallScore != null}
                    <div
                      class="flex flex-col items-center text-center gap-1 shrink-0"
                    >
                      <span
                        class={getGradeClasses(report.summary.overallScore)}
                      >
                        {Math.round(report.summary.overallScore)}
                      </span>
                      <span
                        class="text-[11px] uppercase tracking-wide text-gray-500 mt-2"
                      >
                        Overall Grade
                      </span>
                    </div>
                  {/if}
                </div>
                <div
                  class="flex flex-wrap justify-center md:justify-start gap-4"
                >
                  <div
                    class="flex-1 min-w-[160px] bg-[#ffffff] rounded-lg text-center md:text-left"
                  >
                    <div
                      class="text-xs uppercase tracking-wide text-gray-500 mb-1"
                    >
                      Total Products
                    </div>
                    <div class="text-2xl font-semibold text-[#26363f]">
                      {report.summary.totalProducts}
                    </div>
                  </div>
                  <div
                    class="flex-1 min-w-[160px] bg-[#ffffff] rounded-lg text-center md:text-left"
                  >
                    <div
                      class="text-xs uppercase tracking-wide text-gray-500 mb-1"
                    >
                      Total Issues (All Checks)
                    </div>
                    <div class="text-2xl font-semibold text-[#26363f]">
                      {report.summary.totalIssues}
                    </div>
                  </div>
                </div>

                {#if form?.uplift}
                  <div
                    class="mt-8 bg-gradient-to-br from-[#00a979]/5 to-[#00a979]/10 rounded-xl border-2 border-[#00a979]/30 p-8"
                  >
                    <div class="text-center mb-6">
                      <div
                        class="text-xs uppercase tracking-wider text-[#26363f]/70 font-semibold mb-3"
                      >
                        Opportunity Score
                      </div>
                      <div
                        class="text-5xl md:text-6xl font-bold text-[#00a979] mb-2 leading-none"
                      >
                        +{Math.round(form.uplift.minPercent * 100)}–{Math.round(
                          form.uplift.maxPercent * 100
                        )}%
                      </div>
                      <div class="text-2xl font-semibold text-[#26363f]">
                        Revenue Lift
                      </div>
                    </div>

                    <div class="bg-white/60 rounded-lg p-4 mb-4">
                      <p class="text-sm text-[#26363f] mb-3">
                        Based on your current catalog health score and the mix
                        of issues we found, fixing the problems in this audit
                        could plausibly unlock an estimated revenue uplift from
                        catalog-driven sales.
                        <span class="font-semibold">
                          This is a rough, directional estimate – not a forecast
                          or guarantee.
                        </span>
                      </p>

                      <RevenueImpactCalculator
                        uplift={form.uplift}
                        class="mt-3"
                      />
                    </div>

                    <div
                      class="text-xs text-[#26363f]/70 leading-relaxed text-center"
                    >
                      This estimate is based on generic benchmarks and simple
                      assumptions about how cleaner catalogs tend to convert
                      better. Actual results depend on your traffic mix,
                      merchandising, pricing, ad spend, and many other factors
                      and may be significantly higher or lower.
                    </div>
                  </div>
                {/if}
                <div class="mt-6 flex justify-center">
                  <div class="flex flex-wrap gap-3 justify-center">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold cursor-pointer shadow-lg"
                      onclick={() => {
                        const el = document.getElementById("download-audit");
                        if (el) {
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      Download full audit
                    </button>
                  </div>
                </div>
              </section>

              {#each report.sections as section}
                <section
                  class="bg-[#ffffff] shadow rounded-lg border border-gray-200 p-8"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-semibold text-[#26363f]">
                      {section.title}
                    </h2>
                    <span class="text-xs uppercase tracking-wide text-gray-500">
                      {section.id}
                    </span>
                  </div>

                  <div class="grid gap-8 md:grid-cols-2">
                    {#each section.issues as issue}
                      {@const hasIssues = (issue.count || 0) > 0}
                      <div class="bg-[#ffffff] rounded-lg">
                        <div
                          class="flex w-full items-start justify-between mb-2"
                        >
                          <h3 class="text-lg font-semibold text-[#26363f]">
                            {issue.label}
                          </h3>
                          {#if hasIssues}
                            <span
                              class="inline-flex items-center justify-center text-center rounded-full px-2 py-0.5 text-[11px] font-medium
                                {issue.severity === 'critical'
                                ? 'bg-red-500/15 text-red-600'
                                : issue.severity === 'warning'
                                  ? 'bg-amber-500/15 text-amber-600'
                                  : 'bg-blue-500/15 text-blue-600'}"
                            >
                              {issue.severity}
                            </span>
                          {:else}
                            <span
                              class="inline-flex items-center justify-center text-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#00a979]/10 text-[#008a65] border border-[#00a979]/40"
                            >
                              No issues detected
                            </span>
                          {/if}
                        </div>

                        <p class="text-sm text-[#26363f] mb-3">
                          {getIssueDescription(issue)}
                        </p>
                        <div
                          class="flex items-baseline gap-3 text-sm text-[#26363f] mb-3"
                        >
                          <div>
                            <span class="font-semibold">{issue.count}</span>
                            <span class="ml-1 text-gray-400">items flagged</span
                            >
                          </div>
                          {#if issue.percentage != null && issue.id !== "tag_soup"}
                            <div class="text-gray-600">
                              ~{Math.round(issue.percentage)}%
                            </div>
                          {/if}
                        </div>
                        {#if issue.examples && issue.examples.length}
                          <div class="mt-2">
                            <div
                              class="text-[11px] uppercase tracking-wide text-gray-500 mb-1"
                            >
                              Sample impacted products
                            </div>
                            <ul
                              class="space-y-1 max-h-32 overflow-y-auto pr-1 scrollbar-thin"
                            >
                              {#each issue.examples.slice(0, 5) as example}
                                {#if example && example.title}
                                  {@const productUrl = example.handle
                                    ? getProductUrl(example.handle)
                                    : null}
                                  <li class="text-sm text-[#26363f]">
                                    {#if productUrl}
                                      <a
                                        href={productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="underline decoration-dotted hover:decoration-solid"
                                      >
                                        {example.title}
                                      </a>
                                      {#if example.handle}
                                        <span
                                          class="ml-1 text-[11px] text-gray-500"
                                          >({example.handle})</span
                                        >
                                      {/if}
                                    {:else}
                                      {example.title}
                                      {#if example.handle}
                                        <span
                                          class="ml-1 text-[11px] text-gray-500"
                                          >({example.handle})</span
                                        >
                                      {/if}
                                    {/if}
                                  </li>
                                {:else if example && example.tag}
                                  <li class="text-sm text-[#26363f]">
                                    {example.tag}
                                  </li>
                                {:else if example && example.normalized}
                                  <li class="text-sm text-[#26363f]">
                                    {example.normalized} –{" "}
                                    {example.variants.join(", ")}
                                  </li>
                                {/if}
                              {/each}
                            </ul>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </section>
              {/each}

              <!-- Download full audit CTA + gated form -->
              <section
                id="download-audit"
                class="bg-[#ffffff] shadow rounded-lg border border-gray-200 p-8"
              >
                <div>
                  <h2 class="text-2xl font-semibold text-[#26363f]">
                    Download Your Complete Report
                  </h2>
                  <p class="mt-1 text-xs text-[#26363f]/80">
                    No credit card, no trials, no upsell required—this
                    spreadsheet is completely free.
                  </p>
                  <ul class="mt-2 text-sm text-[#26363f] space-y-1">
                    <li>
                      ✅ Row-by-row fix list for <span class="font-bold"
                        >all {report.summary.totalIssues} issues.</span
                      >
                    </li>
                    <li>
                      ✅ Direct linking to Shopify admin for easy editing.
                    </li>
                    <li>
                      ✅ Ready to share with your team, agency, or developer.
                    </li>
                  </ul>
                </div>

                <form
                  class="mt-4 space-y-4"
                  method="POST"
                  action="/audit/export"
                  onsubmit={async (event) => {
                    event.preventDefault();
                    downloadError = "";
                    downloadSubmitting = true;
                    downloadProgress = 0;
                    downloadProgressMessage = "Preparing export...";

                    // Simulate progress while waiting for server response with uneven jumps
                    let lastDownloadUpdate = Date.now();
                    const updateDownloadProgress = () => {
                      if (downloadProgress < 90) {
                        const now = Date.now();
                        const timeSinceLastUpdate = now - lastDownloadUpdate;

                        // Variable increment size - sometimes small, sometimes large
                        let increment;
                        const rand = Math.random();
                        if (rand < 0.25) {
                          // 25% chance of small increment (0.3-1.5%)
                          increment = 0.3 + Math.random() * 1.2;
                        } else if (rand < 0.65) {
                          // 40% chance of medium increment (1.5-4%)
                          increment = 1.5 + Math.random() * 2.5;
                        } else if (rand < 0.85) {
                          // 20% chance of larger increment (4-7%)
                          increment = 4 + Math.random() * 3;
                        } else {
                          // 15% chance of big jump (7-11%)
                          increment = 7 + Math.random() * 4;
                        }

                        downloadProgress += increment;
                        if (downloadProgress > 90) downloadProgress = 90;
                        lastDownloadUpdate = now;

                        // Update message based on progress
                        if (downloadProgress < 25) {
                          downloadProgressMessage = "Rebuilding audit data...";
                        } else if (downloadProgress < 50) {
                          downloadProgressMessage = "Generating workbook...";
                        } else if (downloadProgress < 75) {
                          downloadProgressMessage = "Compiling checklist...";
                        } else {
                          downloadProgressMessage = "Finalizing export...";
                        }
                      }
                    };

                    // Variable interval timing - sometimes faster, sometimes slower
                    const scheduleDownloadNext = () => {
                      const baseDelay = 180 + Math.random() * 320; // 180-500ms
                      const delay =
                        baseDelay + (Math.random() < 0.15 ? 250 : 0); // 15% chance of extra pause
                      setTimeout(() => {
                        updateDownloadProgress();
                        if (downloadProgress < 90) {
                          scheduleDownloadNext();
                        }
                      }, delay);
                    };
                    scheduleDownloadNext();

                    try {
                      const formEl = event.currentTarget;
                      const formData = new FormData(formEl);
                      const res = await fetch(formEl.action, {
                        method: "POST",
                        body: formData,
                      });

                      if (!res.ok) {
                        let msg =
                          "Failed to generate export. Please check your inputs and try again.";
                        try {
                          const data = await res.json();
                          if (data?.error) msg = data.error;
                        } catch {
                          // Fallback to text or default message
                          try {
                            const text = await res.text();
                            if (text) msg = text;
                          } catch {
                            // ignore
                          }
                        }
                        downloadError = msg;
                      } else {
                        downloadProgress = 95;
                        downloadProgressMessage = "Downloading file...";
                        const blob = await res.blob();
                        downloadProgress = 100;
                        downloadProgressMessage = "Complete!";
                        await new Promise((resolve) =>
                          setTimeout(resolve, 300)
                        );
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "shopify-catalog-audit.xlsx";
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      }
                    } catch (error) {
                      console.error("Error generating audit export", error);
                      downloadError =
                        "Something went wrong generating your export. Please try again in a minute.";
                    } finally {
                      downloadSubmitting = false;
                      downloadProgress = 0;
                      downloadProgressMessage = "";
                    }
                  }}
                >
                  <input
                    type="hidden"
                    name="storeUrl"
                    value={form?.storeUrl || storeUrl}
                  />
                  <input
                    type="hidden"
                    name="storeName"
                    value={form?.storeName || storeName}
                  />

                  {#if downloadError}
                    <div
                      class="bg-red-500/15 border border-red-500 rounded-lg p-3 text-sm text-red-900"
                    >
                      {downloadError}
                    </div>
                  {/if}

                  <div class="grid gap-8 md:grid-cols-2">
                    <div class="md:col-span-1">
                      <label
                        for="auditEmail"
                        class="block text-sm font-medium text-[#26363f] mb-1"
                      >
                        Email to send your audit to
                      </label>
                      <input
                        id="auditEmail"
                        name="email"
                        type="email"
                        bind:value={downloadEmail}
                        required
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#26363f] focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent"
                        placeholder={auditEmailFocused ? "" : "you@example.com"}
                        onfocus={() => (auditEmailFocused = true)}
                        onblur={() => (auditEmailFocused = false)}
                      />
                      <div class="mt-3 flex items-start">
                        <input
                          id="auditConsent"
                          type="checkbox"
                          name="consent"
                          bind:checked={downloadConsent}
                          required
                          class="mt-1 h-4 w-4 text-[#00a979] border-gray-300 rounded"
                        />
                        <label
                          for="auditConsent"
                          class="ml-2 text-sm text-[#26363f] cursor-pointer"
                        >
                          I agree that eComSEOCheck can contact me about this
                          audit and related ecommerce topics.
                        </label>
                      </div>
                    </div>
                    <div
                      class="md:col-span-1 flex flex-col items-center md:items-end md:justify-end"
                    >
                      <button
                        type="submit"
                        class="inline-flex items-center justify-center px-6 py-3 text-base rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={downloadSubmitting ||
                          !downloadEmail ||
                          !downloadConsent}
                      >
                        {#if downloadSubmitting}
                          Generating...
                        {:else}
                          DOWNLOAD FREE SPREADSHEET
                        {/if}
                      </button>
                      <p class="mt-2 text-[11px] text-[#26363f]/70">
                        The catalog spreadsheet is free. Optional done-for-you
                        cleanup is a separate $499 service.
                      </p>
                    </div>
                  </div>
                  {#if downloadSubmitting}
                    <div class="mt-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-[#26363f] font-medium">
                          {downloadProgressMessage}
                        </span>
                        <span class="text-sm text-[#26363f]/80">
                          {Math.round(downloadProgress)}%
                        </span>
                      </div>
                      <div
                        class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
                      >
                        <div
                          class="bg-[#00a979] h-2.5 rounded-full transition-all duration-300 ease-out"
                          style="width: {downloadProgress}%"
                        ></div>
                      </div>
                    </div>
                  {/if}
                </form>
              </section>

              <!-- Done-for-you implementation offer -->
              <section
                id="done-for-you"
                class="bg-[#ffffff] shadow rounded-lg border border-gray-200 p-8"
              >
                {#if report.summary.totalProducts <= 500 || report.summary.totalIssues <= 2500}
                  <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >
                    <div>
                      <h2 class="text-2xl font-semibold text-[#26363f] mb-2">
                        Busy? We'll fix everything for you
                      </h2>
                      <p class="text-sm text-[#26363f]/80 mb-3">
                        Don't have the time or team to work through this audit?
                        We'll go into your Shopify admin and fix the issues for
                        you—from metadata and product templates to collection
                        structure.
                      </p>
                      <ul
                        class="text-sm text-[#26363f]/80 space-y-1 list-disc list-inside"
                      >
                        <li>
                          Hands-on implementation of the fixes in this audit
                        </li>
                        <li>
                          Prioritized plan based on impact, not just effort
                        </li>
                        <li>Follow-up review to confirm everything is clean</li>
                      </ul>
                    </div>
                    <div class="text-center md:text-right md:min-w-[220px]">
                      <div
                        class="text-sm uppercase tracking-wide text-gray-500 mb-1"
                      >
                        Done-for-you store cleanup
                      </div>
                      <div class="text-4xl font-bold text-[#00a979] mb-3">
                        $499
                      </div>

                      <a
                        href="https://buy.stripe.com/14AbJ34vwatMdqt7BOb7y00"
                        class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00a979] hover:bg-[#008a65] text-white text-base font-semibold cursor-pointer shadow-lg hover:shadow-xl transition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Fix My Catalog For Me
                      </a>

                      <div class="mt-3 flex justify-center">
                        <a
                          href="/guarantee"
                          class="inline-flex items-center gap-2 text-xs font-semibold text-[#26363f] tracking-wide hover:text-[#00a979] transition-colors"
                        >
                          <svg
                            class="h-4 w-4 text-[#00a979] flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <span>100% satisfaction guarantee</span>
                        </a>
                      </div>
                    </div>
                  </div>
                {:else}
                  <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >
                    <div>
                      <h2 class="text-2xl font-semibold text-[#26363f] mb-2">
                        Need help fixing everything?
                      </h2>
                      <p class="text-sm text-[#26363f]/80 mb-3">
                        With {report.summary.totalProducts} products and {report
                          .summary.totalIssues} issues, your store needs a custom
                        solution. Let's discuss the best approach for your catalog
                        cleanup.
                      </p>
                      <ul
                        class="text-sm text-[#26363f]/80 space-y-1 list-disc list-inside"
                      >
                        <li>
                          Custom pricing based on your store size and needs
                        </li>
                        <li>
                          Prioritized plan based on impact, not just effort
                        </li>
                        <li>Follow-up review to confirm everything is clean</li>
                      </ul>
                    </div>
                    <div class="text-center md:text-right md:min-w-[220px]">
                      <a
                        href="/contact"
                        class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00a979] hover:bg-[#008a65] text-white text-base font-semibold cursor-pointer shadow-lg hover:shadow-xl transition"
                      >
                        Contact Us
                      </a>

                      <div class="mt-3 flex justify-center">
                        <a
                          href="/guarantee"
                          class="inline-flex items-center gap-2 text-xs font-semibold text-[#26363f] tracking-wide hover:text-[#00a979] transition-colors"
                        >
                          <svg
                            class="h-4 w-4 text-[#00a979] flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <span>100% satisfaction guarantee</span>
                        </a>
                      </div>
                    </div>
                  </div>
                {/if}
              </section>
            </div>
          {/await}
        {/if}
      </div>
    </div>
  </div>

  <!-- Floating Help Me Fix This Button -->
  {#if form?.report}
    <a
      href="#done-for-you"
      onclick={(e) => {
        e.preventDefault();
        const el = document.getElementById("done-for-you");
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }}
      class="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#00a979] hover:bg-[#008a65] text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
    >
      Help Me Fix This
      <svg
        class="w-5 h-5 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  {/if}
</main>
