<script>
  import SEO from "$lib/components/SEO.svelte";

  const pageTitle = "Changelog - eComSEOCheck";
  const pageDescription =
    "Product changelog and release history for eComSEOCheck. See what's new and what we've improved.";
</script>

<SEO
  title={pageTitle}
  description={pageDescription}
  image="/logo.png"
  type="website"
/>

<main class="container mx-auto px-4 py-12 max-w-3xl">
  <h1 class="text-3xl font-bold mb-6 text-gray-900">Changelog</h1>

  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-900">v1.0</h2>
    <p class="text-sm text-gray-500 mb-3">Initial public release</p>
    <ul class="list-disc list-inside space-y-1 text-gray-800">
      <li>Initial launch of ESC.</li>
      <li>Catalog audit workflow and revenue impact calculator.</li>
      <li>Audit export and reporting tools.</li>
    </ul>
  </section>
</main>
