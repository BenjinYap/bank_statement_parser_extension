<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import type { ItemPattern } from '../../utils/replacements/items';
  import Button from '../common/Button.svelte';
  import ComparisonInputs from './ComparisonInputs.svelte';

  type Props = {
    itemPattern:ItemPattern;
    // The first row of a replacement also holds the replacement cell.
    replacementCell?:Snippet;
  };

  let props:Props = $props();
  let patternInput:HTMLInputElement|undefined = $state(undefined);
  let comparisonRows:ComparisonInputs[] = $state([]);

  export function focus() {
    patternInput?.focus();
  }

  async function addComparison() {
    props.itemPattern.comparisons.push({ operator: '<', values: [] });
    // The input of the new row exists only after Svelte updates the DOM.
    await tick();
    comparisonRows.at(-1)?.focus();
  }
</script>

<!-- These cells go in the first row, which is the add comparison row when the pattern has no comparisons. -->
{#snippet leadingCells()}
  {@render props.replacementCell?.()}
  <td
    class="align-top"
    rowspan={props.itemPattern.comparisons.length + 1}
  >
    <input
      type="text"
      class="w-full"
      bind:this={patternInput}
      bind:value={props.itemPattern.pattern}
    />
  </td>
{/snippet}

{#each props.itemPattern.comparisons as comparison, index}
  <tr>
    {#if index === 0}
      {@render leadingCells()}
    {/if}
    <td>
      <ComparisonInputs
        bind:this={comparisonRows[index]}
        comparison={comparison}
      />
    </td>
  </tr>
{/each}
<tr>
  {#if props.itemPattern.comparisons.length === 0}
    {@render leadingCells()}
  {/if}
  <td>
    <Button
      variant="unfilled"
      className="w-full"
      onclick={addComparison}
    >
      Add comparison
    </Button>
  </td>
</tr>
