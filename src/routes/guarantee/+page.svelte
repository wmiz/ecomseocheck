<script>
  import logo from "$lib/assets/logo.png";

  const pageTitle = "100% Satisfaction Guarantee";
  const pageDescription =
    "We guarantee your complete satisfaction with our Shopify catalog audit and cleanup services, or we'll issue a full refund—no questions asked.";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<main class="min-h-[80vh] flex justify-center items-center pt-15">
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <img src={logo} alt="Logo" class="mx-auto mb-6 max-w-[200px] h-auto" />
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
          100% Satisfaction Guarantee
        </h1>
        <p class="text-xl text-[#26363f]/80 max-w-2xl mx-auto">
          Your success is our commitment. If you're not completely satisfied,
          we'll make it right—no questions asked.
        </p>
      </div>

      <!-- Main Guarantee Card -->
      <div
        class="bg-gradient-to-br from-[#00a979]/10 to-[#00a979]/5 rounded-2xl border-2 border-[#00a979]/30 p-8 md:p-12 mb-8 shadow-lg"
      >
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00a979] mb-6 shadow-lg"
          >
            <svg
              class="w-10 h-10 text-white"
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
          <h2 class="text-3xl md:text-4xl font-bold text-[#26363f] mb-4">
            Our Promise to You
          </h2>
          <p
            class="text-lg text-[#26363f]/90 leading-relaxed max-w-2xl mx-auto"
          >
            We stand behind every audit and every cleanup service we deliver. If
            you're not completely satisfied with our work, we'll issue a
            <span class="font-bold text-[#00a979]">full refund</span>—no
            questions asked, no hassle, no exceptions.
          </p>
        </div>

        <div
          class="bg-white/80 rounded-xl p-6 md:p-8 border border-[#00a979]/20"
        >
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/15 flex items-center justify-center mt-1"
              >
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  Full Refund, No Questions Asked
                </h3>
                <p class="text-[#26363f]/80">
                  If our service doesn't meet your expectations for any reason,
                  simply reach out and we'll process a complete refund
                  immediately. No lengthy explanations required, no hoops to
                  jump through.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/15 flex items-center justify-center mt-1"
              >
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  We're Here to Make It Right
                </h3>
                <p class="text-[#26363f]/80">
                  Before processing a refund, we'll work with you to address any
                  concerns and ensure you get the value you expected. Your
                  satisfaction is our top priority, and we're committed to
                  finding a solution that works for you.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/15 flex items-center justify-center mt-1"
              >
                <svg
                  class="w-5 h-5 text-[#00a979]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-[#26363f] mb-2">
                  Simple and Transparent
                </h3>
                <p class="text-[#26363f]/80">
                  No fine print, no hidden conditions, no time limits. This
                  guarantee applies to all our services—from free audits to
                  done-for-you catalog cleanups. We believe in the quality of
                  our work, and we're willing to put our money where our mouth
                  is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- What This Means For You -->
      <section
        class="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-[#26363f] mb-6 text-center">
          What This Means For You
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-3">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-[#26363f]">
                Risk-Free Investment
              </h3>
            </div>
            <p class="text-[#26363f]/80 text-sm">
              Try our services with complete confidence. If we don't deliver the
              value you expect, you get your money back—it's that simple.
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-3">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-[#26363f]">
                Quality You Can Trust
              </h3>
            </div>
            <p class="text-[#26363f]/80 text-sm">
              We're so confident in our expertise and attention to detail that
              we're willing to guarantee your satisfaction. This isn't just a
              policy—it's our commitment to excellence.
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-3">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-[#26363f]">
                Partnership, Not Transaction
              </h3>
            </div>
            <p class="text-[#26363f]/80 text-sm">
              We're not just here to take your money and run. We're building a
              relationship based on trust, quality, and your long-term success.
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex items-center gap-3 mb-3">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-[#26363f]">
                Your Success Matters
              </h3>
            </div>
            <p class="text-[#26363f]/80 text-sm">
              When you succeed, we succeed. This guarantee ensures we're aligned
              with your goals and committed to delivering real, measurable
              results.
            </p>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section
        class="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-[#26363f] mb-6 text-center">
          How It Works
        </h2>
        <div class="space-y-6 max-w-2xl mx-auto">
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-lg"
            >
              1
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-[#26363f] mb-1">
                You Try Our Service
              </h3>
              <p class="text-sm text-[#26363f]/80">
                Whether it's a free catalog audit or a done-for-you cleanup,
                experience our work firsthand.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-lg"
            >
              2
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-[#26363f] mb-1">
                Not Satisfied? Let Us Know
              </h3>
              <p class="text-sm text-[#26363f]/80">
                Reach out to us at any time if you're not completely happy with
                the results. We'll listen to your concerns and work to make it
                right.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a979] text-white flex items-center justify-center font-bold text-lg"
            >
              3
            </div>
            <div class="flex-1 pt-1">
              <h3 class="font-semibold text-[#26363f] mb-1">
                Full Refund, No Questions
              </h3>
              <p class="text-sm text-[#26363f]/80">
                If we can't resolve your concerns to your satisfaction, we'll
                process a complete refund immediately—no hassle, no exceptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <div
        class="text-center bg-gradient-to-br from-[#00a979]/5 to-[#00a979]/10 rounded-xl border border-[#00a979]/20 p-8"
      >
        <h2 class="text-2xl font-semibold text-[#26363f] mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-[#26363f]/80 mb-6 max-w-xl mx-auto">
          Experience the difference that comes with a 100% satisfaction
          guarantee. Try our services risk-free today.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            class="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#00a979] hover:bg-[#008a65] text-white font-semibold shadow-sm hover:shadow-md transition"
          >
            Run a Free Audit
          </a>
        </div>
      </div>
    </div>
  </div>
</main>


