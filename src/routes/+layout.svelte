<script>
  import favicon from "$lib/assets/favicon.ico";
  import logo from "$lib/assets/logo.png";
  import Footer from "$lib/components/Footer.svelte";

  let { children } = $props();
  import "../app.css";

  const recaptchaSiteKey = import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />

  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://www.clarity.ms" />

  <!-- Fonts -->
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    rel="stylesheet"
  />

  <!-- Microsoft Clarity -->
  <script type="text/javascript">
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "utikq67oj5");
  </script>

  <!-- Google reCAPTCHA v3 -->
  {#if recaptchaSiteKey}
    <script
      src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
      async
      defer
    ></script>
  {/if}
</svelte:head>

<!-- Sticky Navbar -->
<nav class="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 group">
        <img
          src={logo}
          alt="eComSEOCheck"
          class="h-8 w-auto"
        />
        <span
          class="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#00a979] transition-colors"
        >
          eComSEOCheck
        </span>
      </a>

      <!-- Nav Links -->
      <div class="flex items-center gap-1">
        <a
          href="/changelog"
          class="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Changelog
        </a>
        <!--
        <a
          href="/guarantee"
          class="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Guarantee
        </a>
        -->
        <a
          href="/contact"
          class="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Contact
        </a>
        <a
          href="/"
          class="ml-2 inline-flex items-center justify-center rounded-xl bg-[#00a979] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#008a65] transition-colors"
        >
          Free Audit
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- Spacer for fixed navbar -->
<div class="h-16"></div>

{@render children()}

<Footer />
