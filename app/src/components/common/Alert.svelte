<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant: 'error';
    children: Snippet;
  }

  let props:Props = $props();

  const VARIANT_CLASSES:Record<Variant, string> = {
    error: 'bg-red-300 text-red-500',
  };
</script>

<div class="variant-{props.variant} rounded-xs px-2 py-1 {VARIANT_CLASSES[props.variant]}">
  {@render props?.children()}
</div>