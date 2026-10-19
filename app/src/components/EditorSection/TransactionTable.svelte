<script lang="ts">
  import type { TransactionGroup } from '../../models/TransactionGroup';
  import TransactionActionsMenu from './TransactionActionsMenu.svelte';

  interface Props {
    transactionGroups: TransactionGroup[];
    selectedGroup: TransactionGroup|undefined;
    onselect: (group: TransactionGroup) => void;
  }

  let props:Props = $props();

  function getLeftBorderClass(group:TransactionGroup):string {
    if (group.edited) {
      return 'border-l-3 border-l-amber-500';
    }
    // A transaction that was auto replaced at parse time has a category and/or a
    // replaced item, so it can be told apart from one that was left untouched.
    if (group.original.category !== '' || group.original.originalItem !== undefined) {
      return 'border-l-3 border-l-amber-950';
    }
    return '';
  }
</script>

<table class="border-collapse rounded-md border-3 border-surface-900">
  <thead>
    <tr class="bg-surface-900">
      <th class="px-2 pt-1 pb-1.5 font-normal text-left w-26">Date</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Category</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
      <th class="px-2 pt-1 pb-1.5 font-normal text-right"></th>
    </tr>
  </thead>
  {#each props.transactionGroups as group}
    <tbody class="group">
      {#each group.current as transaction, i}
        <tr
          class="cursor-pointer {group === props.selectedGroup ? 'bg-orange-950 text-orange-200' : 'group-hover:bg-surface-800'}"
          onclick={() => props.onselect(group)}
        >
          <td class="px-2 py-1 border-y-1 border-surface-900 {getLeftBorderClass(group)}">{transaction.date}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">{transaction.category}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">
            {transaction.item}
            {#if group.original.originalItem}
              <span class="text-xs text-neutral-500">({group.original.originalItem})</span>
            {/if}
          </td>
          <td class="px-2 py-1 border-y-1 border-surface-900 text-right">${transaction.amount.toFixed(2)}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900 text-right">
            <div class="relative">
              <span class="material-symbols-outlined bg-purple-700">
                more_horiz
              </span>
<!--              <TransactionActionsMenu/>-->
            </div>

          </td>
        </tr>
      {/each}
    </tbody>
  {/each}
</table>
