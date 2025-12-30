<script>
  import favicon from "$lib/assets/favicon.ico";
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
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
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

{@render children()}

<Footer />
