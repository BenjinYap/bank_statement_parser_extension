<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import { CATEGORIES } from '../../utils/categories';

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

  export function save() {
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
  <table class="border-3 border-surface-900">
    <thead>
      <tr class="bg-surface-900">
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-40">Category</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each editRows as row}
        <tr>
          <td class="">
            <select
              class=""
              bind:value={row.category}
            >
              <option value="">-- Select --</option>
              {#each CATEGORIES as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </td>
          <td class="">
            <input
              class=""
              type="text"
              bind:value={row.item}
            />
          </td>
          <td class="">
            <input
              class="text-right"
              type="text"
              bind:value={row.amount}
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="mt-1 flex gap-2">
    <button
      class="border border-neutral-600 text-neutral-300 text-xs rounded px-3 py-1.5 hover:bg-neutral-800"
      onclick={addRow}
    >
      Add row
    </button>
  </div>
</div>
