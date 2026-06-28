<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'primary'|'unfilled';

  interface Props {
    variant: Variant;
    className?: string;
    children: Snippet;
    [key: string]: unknown;
  }

  let props:Props = $props();

  const VARIANT_CLASSES:Record<Variant, string> = {
    primary: 'bg-primary-600 text-white rounded px-3 py-1.5 hover:bg-primary-500 active:bg-primary-700',
    unfilled: 'border border-neutral-600 text-neutral-300 rounded px-3 py-1.5 hover:bg-neutral-800',
  };

  let restProps = $derived(
    Object.fromEntries(
      Object.entries(props as Record<string, unknown>).filter(
        ([k]) => k !== 'variant' && k !== 'className' && k !== 'children'
      )
    )
  );
</script>

<button class="{VARIANT_CLASSES[props.variant]} {props.className ?? ''}" {...restProps}>
  {@render props.children()}
</button>
