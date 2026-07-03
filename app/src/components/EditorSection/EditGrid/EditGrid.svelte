<script lang="ts">
  import type { EditRow } from '../../../models/EditRow';
  import EditGridRow from './EditGridRow.svelte';

  interface Props {
    editRows: EditRow[];
  }

  let props:Props = $props();

  function addRow() {
    props.editRows.push({ category: '', item: '', amount: 0 });
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
      {#each props.editRows as row}
        <EditGridRow row={row} />
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
