<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'error'|'info';

  interface Props {
    variant:Variant;
    children: Snippet;
  }

  let props:Props = $props();

  const VARIANT_CLASSES:Record<Variant, string> = {
    info: 'bg-orange-300 text-amber-700',
    error: 'bg-red-300 text-red-500',
  };
</script>

<div class="variant-{props.variant} rounded-xs px-2 py-1 {VARIANT_CLASSES[props.variant]}">
  {@render props?.children()}
</div>