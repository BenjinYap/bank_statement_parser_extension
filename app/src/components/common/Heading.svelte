<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    level:number;
    children:Snippet;
  }

  let props:Props = $props();
  const level = $derived(Number(props.level));

  const LEVEL_CLASSES:Record<number, string> = {
    1: '',
    2: 'text-base',
  };
  const HEADING_CLASSES = 'border-t-3 border-primary-600';
  const finalClasses = $derived(`${HEADING_CLASSES} ${LEVEL_CLASSES[level]}`);
</script>

{#snippet text(children)}
  <span class="inline-block border-l-3 border-b-3 border-primary-600 px-2 pb-1">
    {@render children()}
  </span>
{/snippet}

{#if level === 1}
  <h1 class={finalClasses}>{@render text(props.children)}</h1>
{:else if level === 2}
  <h2 class={finalClasses}>{@render text(props.children)}</h2>
{/if}
