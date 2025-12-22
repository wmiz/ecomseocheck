<script>
  import RevenueImpactCalculator from "$lib/components/RevenueImpactCalculator.svelte";
  import { enhance, applyAction } from "$app/forms";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import logo from "$lib/assets/logo.png";

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

  const pageTitle = "Shopify Product Catalog Health Audit";
  const pageDescription =
    "Run a free Shopify product catalog health audit. Check SEO, conversion, data integrity, and hidden upsell opportunities using only your public /products.json feed.";

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

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<main class=" min-h-[80vh] flex justify-center items-center py-20">
  <div id="audit" class="flex justify-center items-center">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10">
          <img
            src={logo}
            alt="Logo"
            class="mx-auto mb-6 max-w-[180px] h-auto"
          />
          <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
            SEO Audit for Shopify
          </h1>
          <p class="text-xl text-[#26363f] max-w-3xl mx-auto">
            Drop in your Shopify store URL and get a high-level audit of your
            store's health – SEO, conversion, operational data, and hidden
            opportunities.
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
          class="bg-white shadow-2xl rounded-lg border border-gray-200 p-6 mb-10"
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
                  Run Audit
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
              We only read your public
              <code class="px-1 py-0.5 rounded bg-white text-black border"
                >/products.json</code
              >
              and
              <code class="px-1 py-0.5 rounded bg-white text-black border"
                >/meta.json</code
              >
              endpoints. No admin access or private data is used.
            </p>
          </div>
        </form>

        {#if form?.report}
          {#await Promise.resolve(form.report) then report}
            <div class="space-y-10">
              <section
                class="bg-[#ffffff] shadow-2xl rounded-lg border border-gray-200 p-6"
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
                    <h2 class="text-2xl font-semibold mb-2 text-[#26363f]">
                      High-Level Summary
                    </h2>
                    <p class="text-sm text-[#26363f]">
                      We analyzed {report.summary.totalProducts} products from your
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
                    class="flex-1 min-w-[160px] bg-[#ffffff] rounded-lg border border-gray-200 p-4 text-center md:text-left"
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
                    class="flex-1 min-w-[160px] bg-[#ffffff] rounded-lg border border-gray-200 p-4 text-center md:text-left"
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
                    class="mt-8 bg-white rounded-lg border border-dashed border-amber-400/60 p-5"
                  >
                    <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                      Rough revenue impact estimate
                    </h3>
                    <p class="text-sm text-[#26363f] mb-3">
                      Based on your current catalog health score and the mix of
                      issues we found, fixing the problems in this audit could
                      plausibly unlock an estimated
                      <span class="font-semibold">
                        +{Math.round(form.uplift.minPercent * 100)}–{Math.round(
                          form.uplift.maxPercent * 100
                        )}% uplift
                      </span>
                      in revenue from catalog-driven sales.
                      <span class="font-semibold">
                        This is a rough, directional estimate – not a forecast
                        or guarantee.
                      </span>
                    </p>

                    <RevenueImpactCalculator
                      uplift={form.uplift}
                      class="mt-3"
                    />

                    <div class="mt-3 text-xs text-[#26363f]/80 leading-relaxed">
                      This estimate is based on generic benchmarks and simple
                      assumptions about how cleaner catalogs tend to convert
                      better. Actual results depend on your traffic mix,
                      merchandising, pricing, ad spend, and many other factors
                      and may be significantly higher or lower.
                    </div>
                  </div>
                {/if}
                <div class="mt-6 flex justify-center">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-base font-semibold cursor-pointer shadow-sm"
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
              </section>

              {#each report.sections as section}
                <section
                  class="bg-[#ffffff] shadow-2xl rounded-lg border border-gray-200 p-6"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold text-[#26363f]">
                      {section.title}
                    </h2>
                    <span class="text-xs uppercase tracking-wide text-gray-500">
                      {section.id}
                    </span>
                  </div>

                  <div class="grid gap-4 md:grid-cols-2">
                    {#each section.issues as issue}
                      {@const hasIssues = (issue.count || 0) > 0}
                      <div
                        class="bg-[#ffffff] rounded-lg border border-gray-200 p-4"
                      >
                        {#if hasIssues}
                          <div
                            class="flex w-full items-start justify-between mb-2"
                          >
                            <div class="flex items-start gap-2">
                              <h3 class="text-lg font-semibold text-[#26363f]">
                                {issue.label}
                              </h3>
                              <span
                                class="ml-2 inline-flex items-center justify-center text-center rounded-full px-2 py-0.5 text-[11px] font-medium
                                  {issue.severity === 'critical'
                                  ? 'bg-red-500/15 text-red-600'
                                  : issue.severity === 'warning'
                                    ? 'bg-amber-500/15 text-amber-600'
                                    : 'bg-blue-500/15 text-blue-600'}"
                              >
                                {issue.severity}
                              </span>
                            </div>
                          </div>
                        {:else}
                          <div
                            class="flex w-full items-start justify-between mb-2"
                          >
                            <div class="flex items-start gap-2">
                              <h3 class="text-lg font-semibold text-[#26363f]">
                                {issue.label}
                              </h3>
                              <span
                                class="ml-2 inline-flex items-center justify-center text-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#00a979]/10 text-[#008a65] border border-[#00a979]/40"
                              >
                                No issues detected
                              </span>
                            </div>
                          </div>
                        {/if}

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

                  <div class="mt-6 border-t border-gray-200 pt-4 text-center">
                    <p class="text-xs text-[#26363f] mb-2">
                      Want a deeper, done-for-you catalog roadmap based on this
                      audit?
                    </p>
                    <a
                      href="/contact"
                      class="inline-flex items-center justify-center text-sm text-primary-400 hover:text-primary-300 font-medium"
                    >
                      talk to us about implementing these fixes
                      <svg
                        class="w-4 h-4 ml-1"
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
                  </div>
                </section>
              {/each}

              <!-- Download full audit CTA + gated form -->
              <section
                id="download-audit"
                class="bg-[#ffffff] shadow-2xl rounded-lg border border-gray-200 p-6"
              >
                <div>
                  <h2 class="text-xl font-semibold text-[#26363f]">
                    Download full audit (Excel)
                  </h2>
                  <p class="mt-1 text-sm text-[#26363f]">
                    Get a full Excel export of your catalog issues, including a
                    summary dashboard and a “why this matters” column for every
                    line item. Requires your email and permission to contact you
                    about fixing the audit.
                  </p>
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

                  <div class="grid gap-4 md:grid-cols-2">
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
                          I agree that Will can contact me about this audit and
                          related ecommerce topics.
                        </label>
                      </div>
                    </div>
                    <div class="md:col-span-1 flex items-center md:justify-end">
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
                          DOWNLOAD
                        {/if}
                      </button>
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
            </div>
          {/await}
        {/if}
      </div>
    </div>
  </div>
</main>
