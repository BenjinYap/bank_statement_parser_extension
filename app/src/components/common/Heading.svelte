<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from './IconButton.svelte';

  interface Props {
    level:number;
    children:Snippet;
    expanded?:boolean;
  }

  // The heading shows the toggle only when the parent binds `expanded`.
  let { expanded = $bindable(), ...props }:Props = $props();
  const level = $derived(Number(props.level));

  const LEVEL_CLASSES:Record<number, string> = {
    1: '',
    2: 'text-base',
  };
  const HEADING_CLASSES = 'flex items-start border-t-3 border-primary-600';
  const finalClasses = $derived(`${HEADING_CLASSES} ${LEVEL_CLASSES[level]}`);
</script>

{#snippet allChildren(children)}
  <span class="inline-block border-l-3 border-b-3 border-primary-600 px-2 pb-1">
    {@render children()}
  </span>
  {#if expanded !== undefined}
    <span class="mt-1">
      <IconButton
        name={expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
        onclick={() => {
          expanded = !expanded;
        }}
      />
    </span>
  {/if}
{/snippet}

{#if level === 1}
  <h1 class={finalClasses}>{@render allChildren(props.children)}</h1>
{:else if level === 2}
  <h2 class={finalClasses}>{@render allChildren(props.children)}</h2>
{/if}
