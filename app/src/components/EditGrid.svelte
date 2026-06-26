<script lang="ts">
  import type { RowGroup } from '../models/RowGroup';
  import type { ParsedRow } from '../models/ParsedRow';

  interface EditRow {
    category: string;
    item: string;
    amount: string;
  }

  interface Props {
    selectedGroup: RowGroup;
    onsave: (newRows: ParsedRow[]) => void;
  }

  let props:Props = $props();

  let editRows:EditRow[] = $state([]);

  $effect(() => {
    editRows = props.selectedGroup.current.map(r => ({
      category: r.category,
      item: r.item,
      amount: r.amount.toString(),
    }));
  });

  function addRow() {
    editRows.push({ category: '', item: '', amount: '' });
  }

  function save() {
    const date = props.selectedGroup.original.date;
    const newRows:ParsedRow[] = editRows.map(r => ({
      date,
      category: r.category,
      item: r.item,
      amount: parseFloat(r.amount) || 0,
    }));
    props.onsave(newRows);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-2 text-xs font-semibold text-neutral-400">
    <div class="flex-1">Category</div>
    <div class="flex-1">Item</div>
    <div class="w-20">Amount</div>
  </div>
  {#each editRows as row}
    <div class="flex gap-2">
      <input
        class="flex-1 min-w-0 border border-neutral-600 bg-neutral-800 text-neutral-100 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.category}
      />
      <input
        class="flex-1 min-w-0 border border-neutral-600 bg-neutral-800 text-neutral-100 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.item}
      />
      <input
        class="w-20 border border-neutral-600 bg-neutral-800 text-neutral-100 rounded px-2 py-1 text-xs"
        type="text"
        bind:value={row.amount}
      />
    </div>
  {/each}
  <div class="mt-1 flex gap-2">
    <button
      class="border border-neutral-600 text-neutral-300 text-xs rounded px-3 py-1.5 hover:bg-neutral-800"
      onclick={addRow}
    >
      Add row
    </button>
    <button
      class="bg-orange-500 text-white text-xs rounded px-3 py-1.5 hover:bg-orange-600"
      onclick={save}
    >
      Save
    </button>
  </div>
</div>
