<script lang="ts">
  import type { RowGroup } from '../models/RowGroup';

  interface Props {
    rowGroups: RowGroup[];
    selectedGroup: RowGroup|undefined;
    onselect: (group: RowGroup) => void;
  }

  let props:Props = $props();
</script>

<div class="w-1/2 overflow-auto text-sm border-surface-800 border-1 rounded-sm p-2">
  <div class="flex font-semibold text-neutral-400 pb-1">
    <div class="w-24 pr-6">Date</div>
    <div class="flex-1 pr-6">Category</div>
    <div class="flex-1 pr-6">Item</div>
    <div class="w-20 text-right">Amount</div>
  </div>
  {#each props.rowGroups as group}
    <div class="group">
      {#each group.current as row, i}
        <div
          class="flex cursor-pointer py-0.5 {group === props.selectedGroup ? 'font-semibold bg-orange-950 text-orange-200' : 'group-hover:bg-neutral-800'}"
          onclick={() => props.onselect(group)}
        >
          <div class="w-24 tabular-nums pr-6 shrink-0">{i === 0 ? row.date : ''}</div>
          <div class="flex-1 pr-6 truncate">{row.category}</div>
          <div class="flex-1 pr-6 truncate">{row.item}{group.original.originalItem ? ` (${group.original.originalItem})` : ''}</div>
          <div class="w-20 text-right tabular-nums shrink-0">${row.amount.toFixed(2)}</div>
        </div>
      {/each}
    </div>
  {/each}
</div>
