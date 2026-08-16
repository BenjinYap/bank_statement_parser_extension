<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import EditGridTransaction from './EditGridTransaction.svelte';
  import EditGridSplitRow from './EditGridSplitRow.svelte';

  interface Props {
    editTransactions: EditTransaction[];
  }

  let props:Props = $props();

  let total = $derived(
    props.editTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  let previousEditTransactions = props.editTransactions;
  let focusIndex:number = $state(0);
  // Whether the interim "split" row is showing under the first transaction.
  let splitting:boolean = $state(false);

  $effect(() => {
    // Reset focus to the first row whenever a different group is loaded (the
    // parent hands us a brand-new array reference). Focus for rows added during
    // editing is set directly by the mutating functions below.
    const current = props.editTransactions;
    if (current !== previousEditTransactions) {
      focusIndex = 0;
      splitting = false;
      previousEditTransactions = current;
    }
  });

  function addTransaction() {
    const previousTransaction = props.editTransactions.at(-1);
    const category = previousTransaction?.category ?? '';
    props.editTransactions.push({ category, item: '', amount: 0 });
    focusIndex = props.editTransactions.length - 1;
  }

  // Subtracts the committed amount from the first transaction (in integer-cent
  // arithmetic to avoid float drift) and inserts it as a new, more specific row
  // directly underneath, inheriting the first row's category, and focuses it.
  // (The split row calls preventDefault on the committing Enter so the newly
  // focused category dropdown does not pop open.)
  function commitSplit(amount:number) {
    const first = props.editTransactions[0];
    first.amount = (Math.round(first.amount * 100) - Math.round(amount * 100)) / 100;
    props.editTransactions.splice(1, 0, { category: first.category, item: '', amount });
    splitting = false;
    focusIndex = 1;
  }

  function cancelSplit() {
    splitting = false;
  }

  function handleKeydown(event:KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      addTransaction();
    } else if (event.key === '-') {
      event.preventDefault();
      if (props.editTransactions.length > 0) {
        splitting = true;
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

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
      {#each props.editTransactions as transaction, index (transaction)}
        <EditGridTransaction
          transaction={transaction}
          autofocus={index === focusIndex}
        />
        {#if splitting && index === 0}
          <EditGridSplitRow
            oncommit={commitSplit}
            oncancel={cancelSplit}
          />
        {/if}
      {/each}
      <tr>
        <td colspan="2" class="px-2 pt-1 pb-1.5 text-right">Total</td>
        <td class="px-2 pt-1 pb-1.5 text-right">${total.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  <div class="mt-1 flex gap-2">
    <button
      class="border border-neutral-600 text-neutral-300 text-xs rounded px-3 py-1.5 hover:bg-neutral-800"
      onclick={addTransaction}
    >
      Add transaction
    </button>
  </div>
</div>
