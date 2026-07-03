<script lang="ts">
  import type { TransactionGroup } from '../../models/TransactionGroup';
  import type { ParsedTransaction } from '../../models/ParsedTransaction';
  import type { EditTransaction } from '../../models/EditTransaction';
  import EditGrid from './EditGrid/EditGrid.svelte';
  import Section from "../common/Section.svelte";
  import Heading from "../common/Heading.svelte";
  import Button from "../common/Button.svelte";

  interface Props {
    selectedGroup: TransactionGroup;
    onsave: (newTransactions: ParsedTransaction[]) => void;
  }

  let props:Props = $props();
  let editTransactions:EditTransaction[] = $state([]);

  $effect(() => {
    editTransactions = props.selectedGroup.current.map(t => ({
      category: t.category,
      item: t.item,
      amount: t.amount,
    }));
  });

  function save() {
    const date = props.selectedGroup.original.date;
    const newTransactions:ParsedTransaction[] = editTransactions.map(t => ({
      date,
      category: t.category,
      item: t.item,
      amount: t.amount,
    }));
    props.onsave(newTransactions);
  }

  function addTransaction() {
    editTransactions.push({ category: '', item: '', amount: 0 });
  }

  function handleKeydown(event:KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (event.key === 's') {
      event.preventDefault();
      save();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      addTransaction();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Section
  className=""
  title="Edit Transaction"
>
  <div class="flex flex-col gap-2">
    <Heading level="2">Original Transaction</Heading>

    <table class="border-collapse rounded-md border-3 border-surface-900">
      <thead>
        <tr class="bg-surface-900">
          <th class="px-2 pt-1 pb-1.5 font-normal text-left w-40">Category</th>
          <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
          <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-2 py-1 border-y-1 border-surface-900">{props.selectedGroup.original.category}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900">{props.selectedGroup.original.item}</td>
          <td class="px-2 py-1 border-y-1 border-surface-900 text-right">${props.selectedGroup.original.amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <Heading level="2">Granular Transactions</Heading>

    <EditGrid editTransactions={editTransactions} />
    <Button
      variant="primary"
      onclick={save}
    >
      Save
    </Button>
  </div>
</Section>
