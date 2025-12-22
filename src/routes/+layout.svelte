<script>
  import favicon from "$lib/assets/favicon.ico";

  let { children } = $props();
  import "../app.css";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}

<footer class=" border-t border-gray-200 py-8 mt-12">
  <div class="container mx-auto px-4">
    <div class="max-w-5xl mx-auto">
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark"
      >
        <div
          class="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
        >
          <a
            href="/privacy"
            class="text-dark hover:text-primary-500 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            class="text-dark hover:text-primary-500 transition-colors"
          >
            Terms of Service
          </a>
        </div>
        <div class="text-center md:text-right">
          <span class="text-dark">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://willmisback.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-dark hover:text-primary-500 transition-colors"
            >
              Misback Consulting
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</footer>
