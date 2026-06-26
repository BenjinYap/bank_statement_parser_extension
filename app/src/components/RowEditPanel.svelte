<script lang="ts">
  import type { RowGroup } from '../models/RowGroup';
  import type { ParsedRow } from '../models/ParsedRow';
  import EditGrid from './EditGrid.svelte';

  interface Props {
    selectedGroup: RowGroup;
    onsave: (newRows: ParsedRow[]) => void;
  }

  let props:Props = $props();
</script>

<div class="w-80 border-l border-gray-200 pl-4 text-sm flex flex-col gap-4">
  <div class="flex flex-col gap-1">
    <div class="font-semibold text-gray-700">Original</div>
    <div><span class="text-gray-500">Date: </span>{props.selectedGroup.original.date}</div>
    <div><span class="text-gray-500">Category: </span>{props.selectedGroup.original.category}</div>
    <div><span class="text-gray-500">Item: </span>{props.selectedGroup.original.item}</div>
    <div><span class="text-gray-500">Amount: </span>${props.selectedGroup.original.amount.toFixed(2)}</div>
  </div>
  <div class="border-t border-gray-200"></div>
  <EditGrid selectedGroup={props.selectedGroup} onsave={props.onsave} />
</div>
