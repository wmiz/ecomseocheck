<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import logo from "$lib/assets/logo.png";

  let submitting = $state(false);
  let form = $derived($page.form);

  const pageTitle = "Payment Successful";
  const pageDescription =
    "Thank you for your purchase! Please provide your Shopify collaborator code to get started.";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<main class="min-h-[80vh] flex justify-center items-start pt-15 pb-15">
  <div class="container mx-auto px-4 w-full">
    <div class="max-w-3xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-10">
        <img src={logo} alt="Logo" class="mx-auto mb-2 max-w-[200px] h-auto" />
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-emerald-500"
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
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
          Payment Successful!
        </h1>
        <p class="text-xl text-[#26363f] max-w-2xl mx-auto">
          Thank you for your purchase. To get started, we'll need your Shopify
          collaborator code.
        </p>
      </div>

      <!-- Success Message -->
      {#if form?.success}
        <div
          class="bg-emerald-500/15 border border-emerald-500 rounded-lg p-4 mb-6"
        >
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-emerald-400 mr-3 mt-0.5 shrink-0"
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
              <h3 class="text-sm font-semibold text-[#26363f] mb-1">
                Information received!
              </h3>
              <p class="text-sm text-[#26363f]">
                We've received your collaborator code and will be in touch soon
                to get started.
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Message -->
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
                Error submitting information
              </h3>
              <p class="text-sm text-[#26363f]">
                {form.error}
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Instructions Section -->
      <div
        class="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8 mb-6"
      >
        <h2 class="text-2xl font-semibold text-[#26363f] mb-4">
          How to Find Your Shopify Collaborator Code
        </h2>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold"
            >
              1
            </div>
            <div>
              <h3 class="font-semibold text-[#26363f] mb-2">
                Log into your Shopify admin
              </h3>
              <p class="text-sm text-[#26363f]/80">
                Go to your Shopify admin panel and make sure you're logged in as
                the store owner or someone with admin access.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold"
            >
              2
            </div>
            <div>
              <h3 class="font-semibold text-[#26363f] mb-2">
                Navigate to Settings
              </h3>
              <p class="text-sm text-[#26363f]/80">
                Click on <strong>Settings</strong> in the bottom left corner of your
                admin panel.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold"
            >
              3
            </div>
            <div>
              <h3 class="font-semibold text-[#26363f] mb-2">
                Go to Users and permissions
              </h3>
              <p class="text-sm text-[#26363f]/80">
                In the Settings menu, click on
                <strong>Users and permissions</strong>.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 rounded-full bg-[#00a979]/10 flex items-center justify-center text-[#00a979] font-semibold"
            >
              4
            </div>
            <div>
              <h3 class="font-semibold text-[#26363f] mb-2">
                Find your collaborator code
              </h3>
              <p class="text-sm text-[#26363f]/80 mb-2">
                Scroll down to the <strong>Collaborators</strong> section. You should
                see a code that looks like this:
              </p>
              <div
                class="bg-gray-100 rounded-lg p-3 font-mono text-sm text-[#26363f] border border-gray-300"
              >
                abc123def456
              </div>
              <p class="text-sm text-[#26363f]/80 mt-2">
                This is your collaborator code. Copy it and paste it in the form
                below.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8">
        <h2 class="text-2xl font-semibold text-[#26363f] mb-4">
          Submit Your Information
        </h2>
        <p class="text-sm text-[#26363f]/80 mb-6">
          Please provide your email address (the one you used to purchase) and
          your Shopify collaborator code so we can get started.
        </p>

        <form
          method="POST"
          use:enhance={({ formElement }) => {
            submitting = true;
            return async ({ result, update }) => {
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
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Email Address
            </label>
            <p class="text-xs text-[#26363f]/70 mb-2">
              Use the same email address you used to complete your purchase on
              Stripe.
            </p>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#26363f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              for="collaboratorCode"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Shopify Collaborator Code
            </label>
            <p class="text-xs text-[#26363f]/70 mb-2">
              Paste the collaborator code you found in your Shopify admin
              settings.
            </p>
            <input
              id="collaboratorCode"
              name="collaboratorCode"
              type="text"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#26363f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent transition-all font-mono"
              placeholder="abc123def456"
            />
          </div>

          <button
            type="submit"
            class="w-full inline-flex items-center justify-center px-6 py-3 bg-[#00a979] hover:bg-[#008a65] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              Submit Information
            {/if}
          </button>
        </form>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-[#26363f]/80">
          Need help finding your collaborator code?
          <a
            href="/contact"
            class="text-[#00a979] hover:text-[#008a65] font-semibold underline"
            >Contact us</a
          >
          and we'll be happy to assist.
        </p>
      </div>
    </div>
  </div>
</main>
