<script lang="ts">
  import { tick } from 'svelte';
  import type { ItemReplacement } from '../../utils/replacements/items';
  import Button from '../common/Button.svelte';
  import ItemReplacementRows from './ItemReplacementRows.svelte';

  type Props = {
    itemReplacements:ItemReplacement[];
  };

  let props:Props = $props();
  let replacementRows:ItemReplacementRows[] = $state([]);

  async function addReplacement() {
    props.itemReplacements.push({ replacement: '', patterns: [{ pattern: '', comparisons: [] }] });
    // The input of the new row exists only after Svelte updates the DOM.
    await tick();
    replacementRows.at(-1)?.focus();
  }
</script>

<div class="min-h-0 overflow-y-auto">
  <table class="w-full border-3 border-surface-900">
    <thead>
      <tr class="bg-surface-900">
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[30%]">Replacement</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[30%]">Pattern</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[40%]">Amount filter</th>
        <th class="px-2 pt-1 pb-1.5 font-normal w-16"></th>
      </tr>
    </thead>
    <tbody>
      {#each props.itemReplacements as itemReplacement, index}
        <ItemReplacementRows
          bind:this={replacementRows[index]}
          itemReplacement={itemReplacement}
        />
      {/each}

      <tr>
        <td colspan="4">
          <Button
            variant="primary"
            className="rounded-t-none w-full"
            onclick={addReplacement}
          >
            +
          </Button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
