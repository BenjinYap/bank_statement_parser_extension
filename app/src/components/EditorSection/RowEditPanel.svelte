<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import EditGrid from './EditGrid.svelte';

  interface Props {
    selectedGroup: RowGroup;
    onsave: (newRows: ParsedRow[]) => void;
  }

  let props:Props = $props();
</script>

<div class="w-1/2 border-l border-neutral-700 pl-4 text-sm flex flex-col gap-4">
  <div class="flex flex-col gap-1">
    <div class="font-semibold text-neutral-200">Original</div>
    <div><span class="text-neutral-400">Date: </span>{props.selectedGroup.original.date}</div>
    <div><span class="text-neutral-400">Category: </span>{props.selectedGroup.original.category}</div>
    <div><span class="text-neutral-400">Item: </span>{props.selectedGroup.original.item}</div>
    <div><span class="text-neutral-400">Amount: </span>${props.selectedGroup.original.amount.toFixed(2)}</div>
  </div>
  <div class="border-t border-neutral-700"></div>
  <EditGrid selectedGroup={props.selectedGroup} onsave={props.onsave} />
</div>
