<script>
  import logo from "$lib/assets/logo.png";

  let email = $state("");
  let submitted = $state(false);
  let error = $state("");

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      error = "Please enter a valid email address";
      return;
    }

    error = "";
    // TODO: Add email submission logic here
    submitted = true;
    email = "";

    setTimeout(() => {
      submitted = false;
    }, 3000);
  }
</script>

<div
  class="min-h-screen flex flex-col items-center justify-center bg-[#ffffff] px-4 py-16"
>
  <div class="max-w-xl w-full text-center space-y-10">
    <!-- Logo -->
    <div class="flex justify-center mb-10">
      <img src={logo} alt="Logo" class="h-40 w-auto" />
    </div>

    <!-- Main Heading -->
    <h1
      class="text-4xl md:text-5xl font-bold text-[#26363f] mb-3 tracking-tight"
    >
      Coming Soon
    </h1>

    <!-- Subheading -->
    <h2 class="text-2xl md:text-3xl font-semibold text-[#26363f] mb-8">
      Shopify SEO Checker
    </h2>

    <!-- Description -->
    <p
      class="text-lg md:text-xl text-[#26363f] max-w-lg mx-auto leading-relaxed font-light opacity-80"
    >
      We're building a powerful SEO analysis tool specifically designed for
      Shopify stores. Get comprehensive insights and boost your search rankings.
    </p>

    <!-- Email Signup Form -->
    <div class="mt-16">
      <p class="text-[#26363f] mb-6 text-base font-medium">
        Get notified when we launch
      </p>
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
      >
        <input
          type="email"
          bind:value={email}
          placeholder="Enter your email"
          class="flex-1 px-5 py-4 rounded-xl border-2 border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#00a979] focus:border-[#00a979] text-[#26363f] placeholder-[#9ca3af] text-base transition-all"
        />
        <button
          type="submit"
          class="px-8 py-4 bg-[#00a979] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
        >
          Notify Me
        </button>
      </form>

      {#if error}
        <p class="text-[#ef4444] text-sm mt-3 font-medium">{error}</p>
      {/if}

      {#if submitted}
        <p class="text-[#00a979] text-sm mt-3 font-medium">
          ✓ Thanks! We'll notify you when we launch.
        </p>
      {/if}
    </div>
  </div>
</div>
