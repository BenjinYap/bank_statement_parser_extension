<script lang="ts">
  import type { TransactionGroup } from '../../models/TransactionGroup';

  interface Props {
    transactionGroups: TransactionGroup[];
    selectedGroup: TransactionGroup|undefined;
    onselect: (group: TransactionGroup, topOffset: number) => void;
  }

  let props:Props = $props();
  let tableEl:HTMLTableElement|undefined = $state();

  function handleRowClick(group:TransactionGroup, event:MouseEvent) {
    const rowEl = event.currentTarget as HTMLElement;
    const topOffset = rowEl.getBoundingClientRect().top - tableEl!.getBoundingClientRect().top;
    props.onselect(group, topOffset);
  }
</script>

<table
  bind:this={tableEl}
  class="border-collapse rounded-md border-3 border-surface-900"
>
  <thead>
    <tr class="bg-surface-900">
      <th class="px-2 pt-1 pb-1.5 font-normal text-left w-26">Date</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Category</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
    </tr>
  </thead>
  {#each props.transactionGroups as group}
    <tbody class="group">
      {#each group.current as transaction, i}
        <tr
          class="cursor-pointer {group === props.selectedGroup ? 'bg-orange-950 text-orange-200' : 'group-hover:bg-surface-800'}"
          onclick={(event) => handleRowClick(group, event)}
        >
          <td class="px-2 py-1 border-y-1 border-surface-900">{i === 0 ? transaction.date : ''}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">{transaction.category}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">
            {transaction.item}
            {#if group.original.originalItem}
              <span class="text-xs text-neutral-500">({group.original.originalItem})</span>
            {/if}
          </td>
          <td class="px-2 py-1 border-y-1 border-surface-900 text-right">${transaction.amount.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  {/each}
</table>
