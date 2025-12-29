<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import logo from "$lib/assets/logo.png";

  let submitting = $state(false);
  let form = $derived($page.form);

  const pageTitle = "Contact Us";
  const pageDescription =
    "Get in touch with us about your Shopify store audit, catalog cleanup, or any questions you have.";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<main class="min-h-[80vh] flex justify-center items-start pt-15 pb-15">
  <div class="container mx-auto px-4 w-full">
    <div class="max-w-2xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-10">
        <img src={logo} alt="Logo" class="mx-auto mb-2 max-w-[200px] h-auto" />
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[#26363f]">
          Get in Touch
        </h1>
        <p class="text-xl text-[#26363f] max-w-2xl mx-auto">
          Have questions about your audit? Want to learn more about our
          services? We'd love to hear from you.
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
                Message sent successfully!
              </h3>
              <p class="text-sm text-[#26363f]">
                We'll get back to you as soon as possible.
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
                Error sending message
              </h3>
              <p class="text-sm text-[#26363f]">
                {form.error}
              </p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Contact Form -->
      <div class="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8">
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
              for="name"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#26363f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Email
            </label>
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
              for="subject"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#26363f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent transition-all"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label
              for="message"
              class="block text-sm font-medium text-[#26363f] mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#26363f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-transparent transition-all resize-y"
              placeholder="Tell us more about your question or project..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-[#00a979] hover:bg-[#008a65] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p class="text-sm text-[#26363f]/80">
          We typically respond within 24 hours during business days.
        </p>
      </div>
    </div>
  </div>
</main>
