<script>
  import SEO from "$lib/components/SEO.svelte";
  import logo from "$lib/assets/logo.png";

  const pageTitle = "100% Satisfaction Guarantee";
  const pageDescription =
    "We guarantee your complete satisfaction with our Shopify catalog audit and cleanup services, or we'll issue a full refund—no questions asked.";
</script>

{#if false}
<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
/>

<main>
  <!-- Hero Section -->
  <section class="relative bg-[#0f172a] overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:24px_24px]"></div>
    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-[#00a979]/20 flex items-center justify-center">
          <svg
            class="w-8 h-8 text-[#00a979]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
        If You're Not Happy, You Don't Pay.
      </h1>
      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
        Every service we deliver is backed by a full money-back guarantee. No fine print, no conditions, no runaround.
      </p>
    </div>
  </section>

  <!-- Main Content -->
  <section class="bg-[#f8fafc] py-16 md:py-24">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Main Guarantee Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
        <div class="text-center mb-10">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00a979]/10 mb-6"
          >
            <svg
              class="w-8 h-8 text-[#00a979]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Our Promise to You
          </h2>
          <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We stand behind every audit and every cleanup we deliver. If the
            work doesn't meet your expectations for any reason, we'll issue a
            <span class="font-bold text-[#00a979]">full refund</span> — immediately,
            no lengthy explanations, no exceptions.
          </p>
        </div>

        <div class="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-100">
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center mt-0.5"
              >
                <svg
                  class="w-4 h-4 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-900 mb-1">
                  Ask Once. Refunded Immediately.
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  Not satisfied? Email us once and we'll process your full refund the same day. No forms to fill out, no waiting period, no back-and-forth.
                </p>
              </div>
            </div>

            <div class="border-t border-slate-200"></div>

            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center mt-0.5"
              >
                <svg
                  class="w-4 h-4 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-900 mb-1">
                  We'd Rather Fix It Than Refund It
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  If something fell short, tell us. We'll work to make it right before issuing a refund — because our goal is for you to walk away with a healthier store, not just your money back.
                </p>
              </div>
            </div>

            <div class="border-t border-slate-200"></div>

            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center mt-0.5"
              >
                <svg
                  class="w-4 h-4 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-900 mb-1">
                  No Fine Print. No Time Limits.
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  This guarantee covers everything — free audits, done-for-you cleanups, and every service in between. No hidden conditions, no expiry date. We say what we mean.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- What This Means For You -->
      <div class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
          What This Means For You
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#00a979]/10 flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 class="text-base font-semibold text-slate-900">
                Zero Downside Risk
              </h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              You either get a healthier catalog and more sales, or you get your money back. There is no scenario where you lose.
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#00a979]/10 flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-base font-semibold text-slate-900">
                Work That Speaks for Itself
              </h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              We guarantee results because we've done this work hundreds of times. The guarantee isn't a sales tactic — it's proof we stand behind what we deliver.
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#00a979]/10 flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-base font-semibold text-slate-900">
                We're Invested in Your Results
              </h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              We don't win unless you win. Every engagement is built on that principle — which is exactly why this guarantee exists.
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#00a979]/10 flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-base font-semibold text-slate-900">
                Real Fixes, Measurable Outcomes
              </h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              We're not here to deliver a report and disappear. We're here to move the needle on rankings and revenue — and you'll know the difference.
            </p>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
          How It Works
        </h2>
        <div class="space-y-8 max-w-2xl mx-auto">
          <div class="flex gap-5">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-sm"
            >
              1
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-slate-900 mb-1">
                Run the Audit or Hire Us to Fix It
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Start with a free catalog audit or engage us for a done-for-you cleanup. Either way, you see the work before you judge it.
              </p>
            </div>
          </div>

          <div class="flex gap-5">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-sm"
            >
              2
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-slate-900 mb-1">
                Not Happy? Just Say So.
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Send us one email. Tell us what fell short. We'll do everything we can to resolve it — and if we can't, we refund.
              </p>
            </div>
          </div>

          <div class="flex gap-5">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-sm"
            >
              3
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-slate-900 mb-1">
                Full Refund. Same Day.
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                If we can't make it right, we issue a complete refund immediately. No delays, no exceptions, no awkwardness.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-[#0f172a] rounded-2xl p-8 md:p-12 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          See What's Costing You Sales
        </h2>
        <p class="text-slate-300 mb-8 max-w-xl mx-auto">
          Run a free audit on your Shopify store right now. No risk, no commitment — just a clear picture of where you're leaving money on the table.
        </p>
        <a
          href="/"
          class="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#00a979] hover:bg-[#008a65] text-white font-semibold transition-colors"
        >
          Run My Free Audit
        </a>
      </div>
    </div>
  </section>
</main>

{/if}

<main class="bg-[#f8fafc] py-16 md:py-24">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl md:text-4xl font-bold text-slate-900">
      Satisfaction Guarantee
    </h1>
    <p class="mt-3 text-slate-600 text-lg leading-relaxed">
      This page is temporarily disabled while we update the guarantee messaging.
    </p>
  </div>
</main>
