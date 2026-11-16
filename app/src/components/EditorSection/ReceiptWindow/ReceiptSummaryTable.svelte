<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';

  interface Props {
    rows:EditTransaction[];
  }

  let props:Props = $props();
</script>

<table class="border-collapse rounded-md border-3 border-surface-900">
  <thead>
    <tr class="bg-surface-900">
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    {#each props.rows as row (row.item)}
      <tr>
        <td class="px-2 py-1 border-y-1 border-surface-900">{row.item}</td>
        <td class="px-2 py-1 border-y-1 border-surface-900 text-right">${row.amount.toFixed(2)}</td>
      </tr>
    {:else}
      <tr>
        <td
          class="px-2 py-1 border-y-1 border-surface-900"
          colspan="2"
        >
          No named items.
        </td>
      </tr>
    {/each}
  </tbody>
</table>
