<script>
  import logo from "$lib/assets/logo.png";
</script>

<footer class="border-t border-slate-200 bg-slate-50">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
      <!-- Brand Column -->
      <div class="md:col-span-2">
        <a href="/" class="flex items-center gap-3 text-lg font-bold text-slate-900">
          <img src={logo} alt="eComSEOCheck" class="h-8 w-auto" />
          <span>eComSEOCheck</span>
        </a>
        <p class="mt-3 text-sm text-slate-500 max-w-sm leading-relaxed">
          Find out exactly why your Shopify products aren't ranking or converting — and get a prioritized fix list in under 60 seconds. Free.
        </p>
        <p class="mt-4 text-xs text-slate-400">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://willmisback.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-[#00a979] transition-colors"
          >
            Misback Consulting
          </a>
        </p>
      </div>

      <!-- Product Links -->
      <div>
        <h4
          class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4"
        >
          Product
        </h4>
        <ul class="space-y-3">
          <li>
            <a
              href="/"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Free Audit
            </a>
          </li>
          <li>
            <a
              href="/changelog"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Changelog (v2.0)
            </a>
          </li>
          <!--
          <li>
            <a
              href="/guarantee"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Satisfaction Guarantee
            </a>
          </li>
          -->
        </ul>
      </div>

      <!-- Company Links -->
      <div>
        <h4
          class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4"
        >
          Company
        </h4>
        <ul class="space-y-3">
          <li>
            <a
              href="/contact"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Contact Us
            </a>
          </li>
          <li>
            <a
              href="/privacy"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/terms"
              class="text-sm text-slate-600 hover:text-[#00a979] transition-colors"
            >
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
