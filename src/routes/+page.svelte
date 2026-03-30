<script>
  import RevenueImpactCalculator from "$lib/components/RevenueImpactCalculator.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import { enhance, applyAction } from "$app/forms";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount, tick } from "svelte";
  import logo from "$lib/assets/logo.png";
  import { generateServiceSchema } from "$lib/utils/seo.js";
  import { executeRecaptcha } from "$lib/utils/recaptcha.js";

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
  let showHelpFixPulse = $state(false);

  let form = $derived($page.form);
  let urlParam = $derived($page.url.searchParams.get("url") || "");
  let lastAutoSubmittedUrl = $state("");

  const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;

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

  onMount(() => {
    // Only trigger once per session, and only after the mouse leaves the page/window.
    const sessionKey = "esc_help_fix_pulse_shown";
    try {
      if (sessionStorage.getItem(sessionKey) === "1") return;
    } catch (_) {}

    const triggerPulse = () => {
      showHelpFixPulse = true;
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch (_) {}

      // Let it pulse briefly, then stop.
      setTimeout(() => {
        showHelpFixPulse = false;
      }, 6000);
    };

    const onMouseOut = (e) => {
    // Don't "spend" the one-time pulse until the button is actually visible.
    if (!form?.report) return;

      // When leaving the browser window, relatedTarget/toElement are typically null.
      if (!e.relatedTarget && !e.toElement) {
        triggerPulse();
        window.removeEventListener("mouseout", onMouseOut);
      }
    };

    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mouseout", onMouseOut);
    };
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
    description: pageDescription,
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

  // Google Ads conversion tracking function
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof url != "undefined") {
        window.location = url;
      }
    };
    if (typeof gtag !== "undefined") {
      gtag("event", "conversion", {
        send_to: "AW-16678649905/GLW7CNDiy90ZELGAccJE-",
        value: 1.0,
        currency: "USD",
        event_callback: callback,
      });
    }
    return false;
  }
</script>

<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
  {serviceSchema}
/>

<main>
  <!-- ==================== HERO SECTION ==================== -->
  <section class="relative bg-[#0f172a] overflow-hidden">
    <!-- Dot pattern background -->
    <div class="absolute inset-0 bg-dot-pattern"></div>
    <!-- Subtle gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/95 to-[#0f172a]"></div>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 mb-6">
          <svg class="w-4 h-4 text-[#00c896]" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium text-slate-300">5,000+ Shopify stores audited and counting</span>
        </div>
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
          Your Products Are Invisible.
          <br class="hidden sm:block" />
          <span class="text-[#00c896]">Let's Fix That.</span>
        </h1>
        <p class="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Missing titles. Thin descriptions. Products Google can't find and shoppers won't buy. Paste your store URL and get a full catalog health report in under 60 seconds — free.
        </p>
      </div>

      <!-- Audit Form -->
      <div id="audit" class="mx-auto max-w-2xl">
        {#if form?.error}
          <div class="bg-red-500/15 border border-red-500/40 rounded-xl p-4 mb-5">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-red-300 mb-1">We couldn't run your audit</h3>
                <p class="text-sm text-red-300/80">{form.error}</p>
              </div>
            </div>
          </div>
        {/if}

        {#if form?.info}
          <div class="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-5">
            <p class="text-sm text-blue-300">{form.info}</p>
          </div>
        {/if}

        <form
          method="POST"
          action="/audit"
          data-audit-form
          use:enhance={({ formData }) => {
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

            return async ({ result, update }) => {
              // Add reCAPTCHA token if site key is configured
              if (recaptchaSiteKey && !formData.has("recaptchaToken")) {
                try {
                  const token = await executeRecaptcha(
                    recaptchaSiteKey,
                    "audit"
                  );
                  formData.append("recaptchaToken", token);
                } catch (error) {
                  console.error("reCAPTCHA error:", error);
                  // Continue with form submission even if reCAPTCHA fails
                  // The server will handle validation
                }
              }

              // Call update to submit the form (this will include the token if added above)
              await update();

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
          class="relative"
        >
          <div class="flex items-stretch rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-1.5 focus-within:border-[#00a979]/50 focus-within:ring-2 focus-within:ring-[#00a979]/20 transition-all">
            <input
              id="storeUrl"
              name="storeUrl"
              type="text"
              bind:value={storeUrl}
              placeholder="your-store.myshopify.com"
              class="flex-1 min-w-0 bg-transparent px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none text-base"
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
              class="inline-flex items-center cursor-pointer justify-center px-6 py-3 bg-[#00a979] hover:bg-[#008a65] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[140px] text-sm sm:text-base shadow-lg shadow-[#00a979]/20"
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
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </span>
              {:else}
                Audit My Store
              {/if}
            </button>
          </div>

          {#if submitting}
            <div class="mt-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-400 font-medium">{progressMessage}</span>
                <span class="text-sm text-slate-500">{Math.round(progress)}%</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-[#00a979] h-2 rounded-full transition-all duration-300 ease-out"
                  style="width: {progress}%"
                ></div>
              </div>
            </div>
          {/if}

          <div class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              No password or admin access required. We only read public data.
            </span>
          </div>
        </form>
      </div>
    </div>
  </section>

  <!-- ==================== FEATURES SECTION ==================== -->
  {#if !form?.report}
    <section class="bg-white py-20 md:py-24">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            See Exactly Where You're Losing Sales
          </h2>
          <p class="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
            A product-level catalog audit that surfaces real issues with real revenue impact — in the time it takes to make coffee.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Technical SEO Score -->
          <div class="bg-white rounded-2xl border border-slate-100 p-7 text-center shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-center mb-5">
              <div class="w-12 h-12 rounded-xl bg-[#00a979]/10 flex items-center justify-center group-hover:bg-[#00a979]/15 transition-colors">
                <svg class="w-6 h-6 text-[#00a979]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Technical SEO Score</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Missing titles, duplicate meta descriptions, broken structured data — we flag every issue that's costing you rankings.
            </p>
          </div>

          <!-- Conversion Optimization -->
          <div class="bg-white rounded-2xl border border-slate-100 p-7 text-center shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-center mb-5">
              <div class="w-12 h-12 rounded-xl bg-[#00a979]/10 flex items-center justify-center group-hover:bg-[#00a979]/15 transition-colors">
                <svg class="w-6 h-6 text-[#00a979]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Conversion Optimization</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              Spot thin product copy, missing images, and catalog gaps that kill buyer confidence before they reach checkout.
            </p>
          </div>

          <!-- Instant Results -->
          <div class="bg-white rounded-2xl border border-slate-100 p-7 text-center shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-center mb-5">
              <div class="w-12 h-12 rounded-xl bg-[#00a979]/10 flex items-center justify-center group-hover:bg-[#00a979]/15 transition-colors">
                <svg class="w-6 h-6 text-[#00a979]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Instant Results</h3>
            <p class="text-sm text-slate-500 leading-relaxed">
              No installs, no waiting, no BS. Paste your URL and your full audit is ready in under 60 seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- ==================== RESULTS SECTION ==================== -->
  {#if form?.report}
    {#await Promise.resolve(form.report) then report}
      <section class="bg-[#f8fafc] py-16 md:py-20">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">

          <!-- Report Summary Card -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
            <!-- Dark report header banner -->
            <div class="relative bg-[#0f172a] px-6 py-8 md:px-10 md:py-10 overflow-hidden">
              <div class="absolute inset-0 bg-dot-pattern opacity-40"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/95"></div>
              <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div class="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 mb-4">
                    <svg class="w-3.5 h-3.5 text-[#00c896]" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-xs font-medium text-slate-300 uppercase tracking-wider">Catalog Health Report</span>
                  </div>
                  {#if form?.storeName || form?.storeUrl || storeName || storeUrl}
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      {form?.storeName || form?.storeUrl || storeName || storeUrl}
                    </h2>
                  {/if}
                  <p class="mt-2 text-sm text-slate-400">
                    Generated on {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                  </p>
                </div>
                {#if report.summary.overallScore != null}
                  <div class="flex flex-col items-center text-center shrink-0">
                    <div class="relative">
                      <!-- Outer colored ring -->
                      <div class="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center
                        {Math.round(report.summary.overallScore) >= 90 ? 'ring-4 ring-emerald-400/50 bg-emerald-500/15' :
                         Math.round(report.summary.overallScore) >= 80 ? 'ring-4 ring-lime-400/50 bg-lime-500/15' :
                         Math.round(report.summary.overallScore) >= 70 ? 'ring-4 ring-amber-400/50 bg-amber-500/15' :
                         'ring-4 ring-red-400/50 bg-red-500/15'}">
                        <span class="text-4xl md:text-5xl font-extrabold
                          {Math.round(report.summary.overallScore) >= 90 ? 'text-emerald-400' :
                           Math.round(report.summary.overallScore) >= 80 ? 'text-lime-400' :
                           Math.round(report.summary.overallScore) >= 70 ? 'text-amber-400' :
                           'text-red-400'}">
                          {Math.round(report.summary.overallScore)}
                        </span>
                      </div>
                    </div>
                    <span class="text-[11px] uppercase tracking-widest text-slate-400 mt-3 font-semibold">
                      Overall Score
                    </span>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Report body -->
            <div class="p-6 md:p-10">
              <p class="text-base text-slate-700 font-medium mb-1">
                We scanned {report.summary.totalProducts} products and found
                {report.summary.totalIssues} fixable issues that are actively hurting
                your rankings and costing you sales.
              </p>
              <p class="text-sm text-slate-500">
                Audit sourced from your public
                <code class="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono">/products.json</code>
                feed. Issues are ranked by revenue impact — start at the top.
              </p>

              <!-- Stats Row -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-0 mt-8 rounded-xl border border-slate-200 overflow-hidden">
                <div class="p-4 md:p-5 text-center border-r border-slate-200">
                  <div class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Products Scanned</div>
                  <div class="text-2xl md:text-3xl font-bold text-slate-900">{report.summary.totalProducts}</div>
                </div>
                <div class="p-4 md:p-5 text-center md:border-r border-slate-200">
                  <div class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Issues Found</div>
                  <div class="text-2xl md:text-3xl font-bold text-slate-900">{report.summary.totalIssues}</div>
                </div>
                <div class="p-4 md:p-5 text-center border-r border-t md:border-t-0 border-slate-200">
                  <div class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Categories</div>
                  <div class="text-2xl md:text-3xl font-bold text-slate-900">{report.sections.length}</div>
                </div>
                <div class="p-4 md:p-5 text-center border-t md:border-t-0 border-slate-200">
                  <div class="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Health Score</div>
                  <div class="text-2xl md:text-3xl font-bold
                    {report.summary.overallScore != null && Math.round(report.summary.overallScore) >= 90 ? 'text-emerald-600' :
                     report.summary.overallScore != null && Math.round(report.summary.overallScore) >= 80 ? 'text-lime-600' :
                     report.summary.overallScore != null && Math.round(report.summary.overallScore) >= 70 ? 'text-amber-600' :
                     'text-red-600'}">{report.summary.overallScore != null ? Math.round(report.summary.overallScore) + '/100' : 'N/A'}</div>
                </div>
              </div>

            <!-- Revenue Uplift Section -->
            {#if form?.uplift}
              <div class="mt-10 relative rounded-2xl border border-[#00a979]/25 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-[#00a979]/5 via-emerald-50/50 to-[#00a979]/10"></div>
                <div class="relative p-8 md:p-10">
                  <div class="text-center mb-8">
                    <div class="text-xs uppercase tracking-widest text-[#00a979] font-bold mb-4">Estimated Opportunity</div>
                    <div class="relative inline-block">
                      <!-- Animated glow ring behind the number -->
                      <div class="absolute inset-0 -m-4 rounded-3xl bg-[#00a979]/10 animate-pulse"></div>
                      <div class="relative text-7xl md:text-8xl font-extrabold text-[#00a979] leading-none tracking-tight">
                        +{Math.round(form.uplift.minPercent * 100)}&ndash;{Math.round(form.uplift.maxPercent * 100)}%
                      </div>
                    </div>
                    <div class="mt-3 text-xl md:text-2xl font-bold text-slate-900">Potential Revenue Lift</div>
                  </div>

                  <div class="bg-white/80 rounded-xl p-6 mb-5 backdrop-blur-sm border border-white/50 shadow-sm">
                    <p class="text-sm text-slate-600 mb-4 leading-relaxed">
                      Based on your catalog health score and the specific issues we found, addressing the problems in this audit could unlock meaningful revenue from the traffic you're already getting.
                      <span class="font-semibold text-slate-800">
                        This is a directional estimate, not a guarantee — actual results depend on your store, traffic, and how thoroughly issues are fixed.
                      </span>
                    </p>

                    <RevenueImpactCalculator
                      uplift={form.uplift}
                      class="mt-3"
                    />
                  </div>

                  <div class="text-xs text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
                    This estimate is based on generic benchmarks and simple assumptions about how cleaner catalogs tend to convert better. Actual results depend on your traffic mix, merchandising, pricing, ad spend, and many other factors and may be significantly higher or lower.
                  </div>
                </div>
              </div>
            {/if}

            <!-- Download CTA -->
            <div class="mt-8 flex justify-center">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-[#00a979] hover:bg-[#008a65] text-white text-lg font-semibold cursor-pointer shadow-lg shadow-[#00a979]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
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
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Audit
              </button>
            </div>
            </div>
          </div>

          <!-- Issue Sections -->
          {#each report.sections as section}
            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
              <!-- Section header with accent -->
              <div class="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 bg-slate-50 border-b border-slate-200/80">
                <div class="flex items-center gap-3">
                  <div class="w-1 h-8 rounded-full bg-[#00a979]"></div>
                  <h2 class="text-xl md:text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <span class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold bg-white px-3.5 py-1.5 rounded-full border border-slate-200">{section.id}</span>
              </div>

              <div class="p-6 md:p-8">
                <div class="grid gap-5 md:grid-cols-2">
                  {#each section.issues as issue}
                    {@const hasIssues = (issue.count || 0) > 0}
                    <div class="rounded-xl border p-5 transition-all
                      {hasIssues
                        ? issue.severity === 'critical'
                          ? 'border-l-4 border-l-red-500 border-t-red-100 border-r-red-100 border-b-red-100 bg-red-50/40'
                          : issue.severity === 'warning'
                            ? 'border-l-4 border-l-amber-500 border-t-amber-100 border-r-amber-100 border-b-amber-100 bg-amber-50/40'
                            : 'border-l-4 border-l-blue-500 border-t-blue-100 border-r-blue-100 border-b-blue-100 bg-blue-50/40'
                        : 'border-l-4 border-l-emerald-500 border-t-emerald-100 border-r-emerald-100 border-b-emerald-100 bg-emerald-50/30'}">
                      <div class="flex w-full items-start justify-between mb-3">
                        <h3 class="text-base font-semibold text-slate-900 leading-snug pr-3">{issue.label}</h3>
                        {#if hasIssues}
                          <span
                            class="inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-semibold
                              {issue.severity === 'critical'
                              ? 'bg-red-500/15 text-red-700 border border-red-500/25'
                              : issue.severity === 'warning'
                                ? 'bg-amber-500/15 text-amber-700 border border-amber-500/25'
                                : 'bg-blue-500/15 text-blue-700 border border-blue-500/25'}"
                          >
                            {#if issue.severity === 'critical'}
                              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                            {:else if issue.severity === 'warning'}
                              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                            {:else}
                              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                            {/if}
                            {issue.severity}
                          </span>
                        {:else}
                          <span class="inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-700 border border-emerald-500/25">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Passing
                          </span>
                        {/if}
                      </div>

                      <p class="text-sm text-slate-600 mb-4 leading-relaxed">{getIssueDescription(issue)}</p>

                      <!-- Count and percentage -->
                      <div class="flex items-end gap-4 mb-3">
                        <div>
                          <span class="text-3xl font-extrabold {hasIssues ? 'text-slate-900' : 'text-emerald-600'}">{issue.count}</span>
                          <span class="ml-1.5 text-sm text-slate-400 font-medium">items flagged</span>
                        </div>
                        {#if issue.percentage != null && issue.id !== "tag_soup"}
                          <div class="text-sm text-slate-500 font-medium pb-1">~{Math.round(issue.percentage)}% of catalog</div>
                        {/if}
                      </div>

                      <!-- Percentage bar -->
                      {#if issue.percentage != null && issue.id !== "tag_soup" && hasIssues}
                        <div class="w-full bg-slate-200/60 rounded-full h-1.5 mb-4 overflow-hidden">
                          <div
                            class="h-1.5 rounded-full transition-all duration-500
                              {issue.severity === 'critical' ? 'bg-red-500' :
                               issue.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}"
                            style="width: {Math.min(Math.round(issue.percentage), 100)}%"
                          ></div>
                        </div>
                      {/if}

                      {#if issue.examples && issue.examples.length}
                        <div class="mt-3 pt-3 border-t border-slate-200/60">
                          <div class="text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                            Sample impacted products
                          </div>
                          <ul class="space-y-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                            {#each issue.examples.slice(0, 5) as example}
                              {#if example && example.title}
                                {@const productUrl = example.handle ? getProductUrl(example.handle) : null}
                                <li class="text-sm text-slate-700 flex items-start gap-1.5">
                                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0
                                    {issue.severity === 'critical' ? 'bg-red-400' :
                                     issue.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}"></span>
                                  <span>
                                    {#if productUrl}
                                      <a
                                        href={productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="underline decoration-dotted hover:decoration-solid hover:text-[#00a979] transition-colors font-medium"
                                      >
                                        {example.title}
                                      </a>
                                      {#if example.handle}
                                        <span class="ml-1 text-[11px] text-slate-400 font-mono">({example.handle})</span>
                                      {/if}
                                    {:else}
                                      <span class="font-medium">{example.title}</span>
                                      {#if example.handle}
                                        <span class="ml-1 text-[11px] text-slate-400 font-mono">({example.handle})</span>
                                      {/if}
                                    {/if}
                                  </span>
                                </li>
                              {:else if example && example.tag}
                                <li class="text-sm text-slate-700 flex items-start gap-1.5">
                                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                  <span>{example.tag}</span>
                                </li>
                              {:else if example && example.normalized}
                                <li class="text-sm text-slate-700 flex items-start gap-1.5">
                                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                  <span>{example.normalized} &ndash; {example.variants.join(", ")}</span>
                                </li>
                              {/if}
                            {/each}
                          </ul>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/each}

          <!-- Download full audit CTA + gated form -->
          <div
            id="download-audit"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden"
          >
            <div class="p-6 md:p-8">
              <div class="grid md:grid-cols-2 gap-8 md:gap-0">
                <!-- Left: info -->
                <div class="md:pr-8 md:border-r md:border-slate-200">
                  <h2 class="text-xl md:text-2xl font-bold text-slate-900">
                    Get Your Fix List — Free
                  </h2>
                  <p class="mt-2 text-sm text-slate-500">
                    A fully structured spreadsheet, zero cost. No credit card, no trial, no upsell. Ever.
                  </p>
                  <ul class="mt-5 text-sm text-slate-700 space-y-3">
                    <li class="flex items-start gap-2.5">
                      <svg class="w-5 h-5 text-[#00a979] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      <span>Every fix, product by product — all <span class="font-semibold">{report.summary.totalIssues} issues</span> mapped out for you.</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <svg class="w-5 h-5 text-[#00a979] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      <span>Deep links straight into your Shopify admin — click and fix, no hunting around.</span>
                    </li>
                    <li class="flex items-start gap-2.5">
                      <svg class="w-5 h-5 text-[#00a979] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      <span>Clean, shareable format — hand it off to your team, dev, or agency without explanation.</span>
                    </li>
                  </ul>
                </div>
                <!-- Right: form -->
                <div class="md:pl-8">

            <form
              class="space-y-4"
              method="POST"
              action="/audit/export"
              onsubmit={async (event) => {
                event.preventDefault();

                // Track Google Ads conversion
                gtag_report_conversion();

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
              <input type="hidden" name="storeUrl" value={form?.storeUrl || storeUrl} />
              <input type="hidden" name="storeName" value={form?.storeName || storeName} />

              {#if downloadError}
                <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-700">
                  {downloadError}
                </div>
              {/if}

              <div>
                  <label for="auditEmail" class="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your email
                  </label>
                  <input
                    id="auditEmail"
                    name="email"
                    type="email"
                    bind:value={downloadEmail}
                    required
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all placeholder-slate-400"
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
                      class="mt-1 h-4 w-4 text-[#00a979] border-slate-300 rounded accent-[#00a979]"
                    />
                    <label for="auditConsent" class="ml-2 text-sm text-slate-600 cursor-pointer">
                      Yes, Misback Consulting can follow up about this audit and share ecommerce tips.
                    </label>
                  </div>
                </div>
                <div class="mt-5">
                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base rounded-xl bg-[#00a979] hover:bg-[#008a65] text-white font-semibold cursor-pointer shadow-lg shadow-[#00a979]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={downloadSubmitting || !downloadEmail || !downloadConsent}
                  >
                    {#if downloadSubmitting}
                      <svg class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    {:else}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Free Spreadsheet
                    {/if}
                  </button>
                </div>
              {#if downloadSubmitting}
                <div class="mt-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-slate-600 font-medium">{downloadProgressMessage}</span>
                    <span class="text-sm text-slate-400">{Math.round(downloadProgress)}%</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      class="bg-[#00a979] h-2 rounded-full transition-all duration-300 ease-out"
                      style="width: {downloadProgress}%"
                    ></div>
                  </div>
                </div>
              {/if}
            </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    {/await}
  {/if}

  <!-- Floating Help Me Fix This Button -->
  {#if form?.report}
    <a href="/contact" class="fixed bottom-6 right-6 z-50 group">
      <span
        class={`absolute inset-0 rounded-2xl bg-[#00a979]/40 ${showHelpFixPulse ? "animate-ping" : ""}`}
      ></span>
      <span class="relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#00a979] hover:bg-[#008a65] text-white text-base font-semibold shadow-xl shadow-[#00a979]/30 hover:shadow-2xl transition-all duration-200 cursor-pointer">
        Help Me Fix This
        <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  {/if}
</main>
