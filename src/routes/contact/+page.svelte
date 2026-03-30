<script>
  import SEO from "$lib/components/SEO.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import logo from "$lib/assets/logo.png";
  import { executeRecaptcha } from "$lib/utils/recaptcha.js";

  let submitting = $state(false);
  let form = $derived($page.form);

  const pageTitle = "Contact Us";
  const pageDescription =
    "Get in touch with us about your Shopify store audit, catalog cleanup, or any questions you have.";

  const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;
</script>

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
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
        Let's Talk About Your Store
      </h1>
      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
        Questions about your audit results? Want us to fix the issues for you? Reach out — we typically respond within one business day.
      </p>
    </div>
  </section>

  <!-- Main Content -->
  <section class="bg-[#f8fafc] py-16 md:py-24">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Success Message -->
      {#if form?.success}
        <div
          class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 mb-1">
                Got it — we'll be in touch soon.
              </h3>
              <p class="text-sm text-slate-600">
                We typically respond within one business day.
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
      {#if form?.error}
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-red-500 mt-0.5 shrink-0"
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
              <h3 class="text-sm font-semibold text-slate-900 mb-1">
                Error sending message
              </h3>
              <p class="text-sm text-slate-600">
                {form.error}
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Contact Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
        <form
          method="POST"
          use:enhance={({ formElement, formData, cancel }) => {
            submitting = true;
            return async ({ result, update }) => {
              // Add reCAPTCHA token if site key is configured
              if (recaptchaSiteKey) {
                try {
                  const token = await executeRecaptcha(
                    recaptchaSiteKey,
                    "contact"
                  );
                  formData.append("recaptchaToken", token);
                } catch (error) {
                  console.error("reCAPTCHA error:", error);
                  submitting = false;
                  // Continue with form submission even if reCAPTCHA fails
                  // The server will handle validation
                }
              }

              await update();
              submitting = false;
              // Reset form on success
              if (result.type === "success") {
                formElement?.reset();
              }
            };
          }}
          class="space-y-6"
        >
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-slate-900 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-slate-900 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              for="subject"
              class="block text-sm font-medium text-slate-900 mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label
              for="message"
              class="block text-sm font-medium text-slate-900 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all resize-y"
              placeholder="Tell us more about your question or project..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full cursor-pointer inline-flex items-center justify-center px-6 py-3.5 bg-[#00a979] hover:bg-[#008a65] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {#if submitting}
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
              Sending...
            {:else}
              Send Message
            {/if}
          </button>
        </form>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-slate-500">
          We typically respond within one business day.
        </p>
      </div>
    </div>
  </section>
</main>
