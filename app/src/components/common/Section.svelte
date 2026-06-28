<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let props:Props = $props();
</script>

<section class="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  {@render props.children()}
</section>
