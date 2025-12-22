<script>
  import favicon from "$lib/assets/favicon.ico";
  import Footer from "$lib/components/Footer.svelte";

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

<Footer />
