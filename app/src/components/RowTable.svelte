<script lang="ts">
  import type { ParsedRow } from '../models/ParsedRow';

  let { rows, selectedRow, onselect }: {
    rows: ParsedRow[];
    selectedRow: ParsedRow|undefined;
    onselect: (row: ParsedRow) => void;
  } = $props();
</script>

<div class="flex-1 overflow-auto">
  <table class="text-sm w-full border-collapse">
    <thead>
      <tr>
        <th class="font-semibold text-gray-600 text-left pb-1 pr-6">Date</th>
        <th class="font-semibold text-gray-600 text-left pb-1 pr-6">Category</th>
        <th class="font-semibold text-gray-600 text-left pb-1 pr-6">Item</th>
        <th class="font-semibold text-gray-600 text-right pb-1">Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr
          class="cursor-pointer hover:bg-gray-50 {row === selectedRow ? 'font-bold' : ''}"
          onclick={() => onselect(row)}
        >
          <td class="tabular-nums pr-6 py-0.5">{row.date}</td>
          <td class="pr-6 py-0.5">{row.category}</td>
          <td class="pr-6 py-0.5">{row.item}</td>
          <td class="text-right tabular-nums py-0.5">${row.amount.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
