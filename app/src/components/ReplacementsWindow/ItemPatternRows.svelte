<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import { getRowCount, type ItemPattern } from '../../utils/replacements/items';
  import IconButton from '../common/IconButton.svelte';
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

  async function addComparison(index:number) {
    props.itemPattern.comparisons.splice(index, 0, { operator: '<', values: [] });
    // The input of the new row exists only after Svelte updates the DOM.
    await tick();
    comparisonRows[index]?.focus();
  }

  function deleteComparison(index:number) {
    props.itemPattern.comparisons.splice(index, 1);
  }
</script>

<!-- These cells go in the first row. A pattern with no comparisons has one row with an empty amount filter cell. -->
{#snippet leadingCells()}
  {@render props.replacementCell?.()}
  <td
    class="align-top"
    rowspan={getRowCount(props.itemPattern)}
  >
    <input
      type="text"
      class="w-full"
      bind:this={patternInput}
      bind:value={props.itemPattern.pattern}
    />
  </td>
{/snippet}

{#snippet actionsCell(addIndex:number, deleteIndex?:number)}
  <td class="px-2">
    <div class="flex justify-end gap-2 leading-0 invisible group-hover:visible">
      {#if deleteIndex !== undefined}
        <IconButton
          name="delete"
          onclick={() => deleteComparison(deleteIndex)}
        />
      {/if}
      <IconButton
        name="add"
        onclick={() => addComparison(addIndex)}
      />
    </div>
  </td>
{/snippet}

{#each props.itemPattern.comparisons as comparison, index}
  <tr class="group">
    {#if index === 0}
      {@render leadingCells()}
    {/if}
    <td>
      <ComparisonInputs
        bind:this={comparisonRows[index]}
        comparison={comparison}
      />
    </td>
    {@render actionsCell(index + 1, index)}
  </tr>
{/each}
{#if props.itemPattern.comparisons.length === 0}
  <tr class="group">
    {@render leadingCells()}
    <td></td>
    {@render actionsCell(0)}
  </tr>
{/if}
