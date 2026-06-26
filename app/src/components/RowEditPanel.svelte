<script lang="ts">
  import type { ParsedRow } from '../models/ParsedRow';

  let { selectedRow }: { selectedRow: ParsedRow } = $props();
</script>

<div class="w-72 border-l border-gray-200 pl-4 text-sm">
  <div class="flex flex-col gap-2">
    <div class="font-semibold text-gray-700">Edit Row</div>
    <div><span class="text-gray-500">Date: </span>{selectedRow.date}</div>
    <div><span class="text-gray-500">Category: </span>{selectedRow.category}</div>
    <div><span class="text-gray-500">Item: </span>{selectedRow.item}</div>
    <div><span class="text-gray-500">Amount: </span>${selectedRow.amount.toFixed(2)}</div>
  </div>
</div>
