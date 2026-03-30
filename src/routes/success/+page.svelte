<script>
  import SEO from "$lib/components/SEO.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import logo from "$lib/assets/logo.png";
  import { executeRecaptcha } from "$lib/utils/recaptcha.js";

  let submitting = $state(false);
  let form = $derived($page.form);

  const pageTitle = "Payment Successful";
  const pageDescription =
    "Thank you for your purchase! Please provide your Shopify collaborator code to get started.";

  const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;
</script>

<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
  noindex={true}
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
        You're In — Let's Get Started.
      </h1>
      <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
        Your purchase is confirmed. One quick step before we dive in: we'll need your Shopify collaborator code so we can access your store and get to work.
      </p>
    </div>
  </section>

  <!-- Main Content -->
  <section class="bg-[#f8fafc] py-16 md:py-24">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

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
                All set — we'll reach out within one business day.
              </h3>
              <p class="text-sm text-slate-600">
                We've got your collaborator code and we're ready to get started. Expect a message from us shortly with next steps.
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
                Error submitting information
              </h3>
              <p class="text-sm text-slate-600">
                {form.error}
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Instructions Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 mb-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">
          How to Find Your Shopify Collaborator Code
        </h2>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold text-sm"
            >
              1
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 mb-1">
                Log into your Shopify admin
              </h3>
              <p class="text-sm text-slate-600">
                Go to your Shopify admin panel and make sure you're logged in as
                the store owner or someone with admin access.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold text-sm"
            >
              2
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 mb-1">
                Navigate to Settings
              </h3>
              <p class="text-sm text-slate-600">
                Click on <strong>Settings</strong> in the bottom left corner of your
                admin panel.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold text-sm"
            >
              3
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 mb-1">
                Go to Users and permissions
              </h3>
              <p class="text-sm text-slate-600">
                In the Settings menu, click on
                <strong>Users and permissions</strong>.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold text-sm"
            >
              4
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 mb-1">
                Find your collaborator code
              </h3>
              <p class="text-sm text-slate-600 mb-3">
                Scroll down to the <strong>Collaborators</strong> section. You should
                see a code that looks like this:
              </p>
              <div
                class="bg-slate-50 rounded-xl p-3.5 font-mono text-sm text-slate-900 border border-slate-200"
              >
                abc123def456
              </div>
              <p class="text-sm text-slate-600 mt-3">
                This is your collaborator code. Copy it and paste it in the form
                below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
        <h2 class="text-2xl font-bold text-slate-900 mb-2">
          Send Us Your Details
        </h2>
        <p class="text-sm text-slate-600 mb-8">
          Enter the email you used at checkout and your Shopify collaborator code. That's all we need to begin.
        </p>

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
                    "submit"
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
              for="email"
              class="block text-sm font-medium text-slate-900 mb-1.5"
            >
              Email Address
            </label>
            <p class="text-xs text-slate-500 mb-2">
              Use the same email address you used to complete your purchase on
              Stripe.
            </p>
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
              for="collaboratorCode"
              class="block text-sm font-medium text-slate-900 mb-1.5"
            >
              Shopify Collaborator Code
            </label>
            <p class="text-xs text-slate-500 mb-2">
              Paste the collaborator code you found in your Shopify admin
              settings.
            </p>
            <input
              id="collaboratorCode"
              name="collaboratorCode"
              type="text"
              required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a979]/40 focus:border-[#00a979] transition-all font-mono"
              placeholder="abc123def456"
            />
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
              Submitting...
            {:else}
              Send My Details
            {/if}
          </button>
        </form>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-slate-500">
          Need help finding your collaborator code?
          <a
            href="/contact"
            class="text-[#00a979] hover:text-[#008a65] font-semibold"
            >Contact us</a
          >
          and we'll be happy to assist.
        </p>
      </div>
    </div>
  </section>
</main>
