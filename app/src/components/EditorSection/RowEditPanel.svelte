<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import type { EditRow } from '../../models/EditRow';
  import EditGrid from './EditGrid.svelte';
  import Section from "../common/Section.svelte";
  import Heading from "../common/Heading.svelte";
  import Button from "../common/Button.svelte";

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
      amount: r.amount,
    }));
  });

  function save() {
    const date = props.selectedGroup.original.date;
    const newRows:ParsedRow[] = editRows.map(r => ({
      date,
      category: r.category,
      item: r.item,
      amount: r.amount,
    }));
    props.onsave(newRows);
  }
</script>

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

    <EditGrid editRows={editRows} />
    <Button
      variant="primary"
      onclick={save}
    >
      Save
    </Button>
  </div>
</Section>