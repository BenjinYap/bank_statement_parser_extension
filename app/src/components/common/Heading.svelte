<script lang="ts">
  import type { Snippet } from 'svelte';
  import TransactionActionsMenuButton from '../EditorSection/TransactionActionsMenuButton.svelte';

  interface Props {
    level:number;
    children:Snippet;
    onExpandToggle?:(expanded:boolean) => void;
  }

  let props:Props = $props();
  let expanded = $state(false);
  const level = $derived(Number(props.level));

  const LEVEL_CLASSES:Record<number, string> = {
    1: '',
    2: 'text-base',
  };
  const HEADING_CLASSES = 'flex items-start border-t-3 border-primary-600';
  const finalClasses = $derived(`${HEADING_CLASSES} ${LEVEL_CLASSES[level]}`);
</script>

{#snippet allChildren(children)}
  <div class="inline-block border-l-3 border-b-3 border-primary-600 px-2 pb-1">
    {@render children()}
  </div>
  {#if props.onExpandToggle}
    <div class="mt-1">
      <TransactionActionsMenuButton
        name={expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
        onclick={() => {
          expanded = !expanded;
          props.onExpandToggle(expanded);
        }}
      />
    </div>
  {/if}
{/snippet}

{#if level === 1}
  <h1 class={finalClasses}>{@render allChildren(props.children)}</h1>
{:else if level === 2}
  <h2 class={finalClasses}>{@render allChildren(props.children)}</h2>
{/if}
