<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import Section from "../common/Section.svelte";

  interface Props {
    rowGroups: RowGroup[];
    selectedGroup: RowGroup|undefined;
    onselect: (group: RowGroup) => void;
  }

  let props:Props = $props();
</script>

<table class="border-collapse rounded-md border-3 border-surface-900">
  <thead>
    <tr class="bg-surface-900">
      <th class="px-2 pt-1 pb-1.5 font-normal text-left w-26">Date</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Category</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
    </tr>
  </thead>
  {#each props.rowGroups as group}
    <tbody class="group">
      {#each group.current as row, i}
        <tr
          class="cursor-pointer {group === props.selectedGroup ? 'bg-orange-950 text-orange-200' : 'group-hover:bg-surface-800'}"
          onclick={() => props.onselect(group)}
        >
          <td class="px-2 py-1 border-y-1 border-surface-900">{i === 0 ? row.date : ''}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">{row.category}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">{row.item}{group.original.originalItem ? ` (${group.original.originalItem})` : ''}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900 text-right">${row.amount.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  {/each}
</table>