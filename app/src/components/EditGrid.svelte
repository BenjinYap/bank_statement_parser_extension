<script lang="ts">
  import type { RowGroup } from '../models/RowGroup';
  import type { ParsedRow } from '../models/ParsedRow';

  interface EditRow {
    category: string;
    item: string;
    amount: string;
  }

  let { selectedGroup, onsave }: {
    selectedGroup: RowGroup;
    onsave: (newRows: ParsedRow[]) => void;
  } = $props();

  let editRows:EditRow[] = $state([]);

  $effect(() => {
    editRows = selectedGroup.current.map(r => ({
      category: r.category,
      item: r.item,
      amount: r.amount.toString(),
    }));
  });

  function addRow() {
    editRows.push({ category: '', item: '', amount: '' });
  }

  function save() {
    const date = selectedGroup.original.date;
    const newRows:ParsedRow[] = editRows.map(r => ({
      date,
      category: r.category,
      item: r.item,
      amount: parseFloat(r.amount) || 0,
    }));
    onsave(newRows);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-2 text-xs font-semibold text-gray-500">
    <div class="flex-1">Category</div>
    <div class="flex-1">Item</div>
    <div class="w-20">Amount</div>
  </div>
  {#each editRows as row}
    <div class="flex gap-2">
      <input
        class="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.category}
      />
      <input
        class="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.item}
      />
      <input
        class="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.amount}
      />
    </div>
  {/each}
  <div class="mt-1 flex gap-2">
    <button
      class="border border-gray-300 text-gray-600 text-xs rounded px-3 py-1.5 hover:bg-gray-50"
      onclick={addRow}
    >
      Add row
    </button>
    <button
      class="bg-blue-600 text-white text-xs rounded px-3 py-1.5 hover:bg-blue-700"
      onclick={save}
    >
      Save
    </button>
  </div>
</div>
