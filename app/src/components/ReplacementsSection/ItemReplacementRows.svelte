<script lang="ts">
  import { tick } from 'svelte';
  import type { ItemReplacement } from '../../utils/replacements/items';
  import Button from '../common/Button.svelte';
  import ItemPatternRows from './ItemPatternRows.svelte';

  type Props = {
    itemReplacement:ItemReplacement;
  };

  let props:Props = $props();
  let replacementInput:HTMLInputElement|undefined = $state(undefined);
  let patternRows:ItemPatternRows[] = $state([]);

  const rowCount:number = $derived.by(() => {
    // The add pattern row.
    let total:number = 1;
    for (const itemPattern of props.itemReplacement.patterns) {
      // The comparison rows and the add comparison row.
      total += itemPattern.comparisons.length + 1;
    }
    return total;
  });

  export function focus() {
    replacementInput?.focus();
  }

  async function addPattern() {
    props.itemReplacement.patterns.push({ pattern: '', comparisons: [] });
    // The input of the new row exists only after Svelte updates the DOM.
    await tick();
    patternRows.at(-1)?.focus();
  }
</script>

{#snippet replacementCell()}
  <td
    class="align-top"
    rowspan={rowCount}
  >
    <input
      type="text"
      class="w-full"
      bind:this={replacementInput}
      bind:value={props.itemReplacement.replacement}
    />
  </td>
{/snippet}

{#each props.itemReplacement.patterns as itemPattern, index}
  <ItemPatternRows
    bind:this={patternRows[index]}
    itemPattern={itemPattern}
    replacementCell={index === 0 ? replacementCell : undefined}
  />
{/each}
<tr>
  <td colspan="2">
    <Button
      variant="primary"
      className="w-full rounded-none"
      onclick={addPattern}
    >
      Add pattern
    </Button>
  </td>
</tr>