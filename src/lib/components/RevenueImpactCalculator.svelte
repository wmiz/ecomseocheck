<script>
  export let uplift = null;

  let monthlyRevenueInput = "";

  const parseRevenue = (value) => {
    if (value == null) return null;
    const numeric = Number(
      value
        .toString()
        .replace(/[^0-9.,]/g, "")
        .replace(/,/g, "")
    );
    if (!Number.isFinite(numeric) || numeric <= 0) return null;
    return numeric;
  };

  $: revenueValue = parseRevenue(monthlyRevenueInput);

  $: minDollarImpact =
    uplift && revenueValue != null
      ? Math.round(revenueValue * uplift.minPercent)
      : null;
  $: maxDollarImpact =
    uplift && revenueValue != null
      ? Math.round(revenueValue * uplift.maxPercent)
      : null;
</script>

{#if !uplift}
  <p class="text-sm text-gray-700">
    Run an audit first to see a very rough, directional revenue impact estimate.
  </p>
{:else}
  <div class="space-y-3">
    <div class="flex flex-col gap-2 md:flex-row md:items-start">
      <div class="flex-1">
        <label
          for="monthlyRevenue"
          class="block text-xs font-medium uppercase tracking-wide text-gray-600 mb-1"
        >
          Optional: your approximate current monthly online revenue
        </label>
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm"
          >
            $
          </span>
          <input
            id="monthlyRevenue"
            type="text"
            bind:value={monthlyRevenueInput}
            inputmode="decimal"
            placeholder="e.g. 75000"
            class="w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <p class="mt-1 text-[11px] text-gray-500">
          This is only used on your device to show a ballpark dollar range
          alongside the percentage uplift. It is not stored or sent anywhere.
        </p>
      </div>
      <div class="md:w-56">
        <div
          class="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-gray-900"
        >
          <div class="text-[11px] uppercase tracking-wide text-emerald-700">
            Estimated uplift range
          </div>
          <div class="mt-1 font-semibold">
            +{Math.round(uplift.minPercent * 100)}–{Math.round(
              uplift.maxPercent * 100
            )}% in catalog-driven sales
          </div>
          {#if minDollarImpact != null && maxDollarImpact != null}
            <div class="mt-1 text-xs text-gray-800">
              Roughly
              <span class="font-semibold">
                ${minDollarImpact.toLocaleString()}–${maxDollarImpact.toLocaleString()}
              </span>
              per month, if your current revenue input is accurate.
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
