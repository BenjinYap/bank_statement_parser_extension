<script lang="ts">
  import type { LineItemName } from '../../utils/replacements/lineItems';
  import IconButton from '../common/IconButton.svelte';

  type Props = {
    // The receipt window adds the entries. This table only edits and deletes them.
    lineItemNames:LineItemName[];
  };

  let props:Props = $props();
</script>

<div class="min-h-0 overflow-y-auto">
  <table class="w-full border-3 border-surface-900">
    <thead>
      <tr class="bg-surface-900">
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Line item</th>
        <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Item name</th>
        <th class="px-2 pt-1 pb-1.5 font-normal w-8"></th>
      </tr>
    </thead>
    <tbody>
      <!-- The line items are unique, because recordLineItemNames replaces an entry for the same line item. -->
      {#each props.lineItemNames as entry, index (entry.lineItem)}
        <tr class="group">
          <td class="px-2 break-all">{entry.lineItem}</td>
          <td>
            <input
              type="text"
              class="w-full"
              bind:value={entry.itemName}
            />
          </td>
          <td class="px-2">
            <div class="flex justify-end leading-0 invisible group-hover:visible">
              <IconButton
                name="delete"
                onclick={() => props.lineItemNames.splice(index, 1)}
              />
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td
            class="px-2 py-1"
            colspan="3"
          >
            No line items.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
