<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import EditGrid from './EditGrid.svelte';
  import Section from "../common/Section.svelte";
  import Heading from "../common/Heading.svelte";

  interface Props {
    selectedGroup: RowGroup;
    onsave: (newRows: ParsedRow[]) => void;
  }

  let props:Props = $props();
</script>

<Section
  className=""
  title="Edit Transaction"
>
  <div class="flex flex-col gap-2">
    <Heading level="2">Original Transaction</Heading>
    <table class="border-collapse rounded-md border-3 border-neutral-900">
      <thead>
        <tr class="bg-neutral-900">
          <th class="px-2 pt-1 pb-1.5 font-normal text-left">Category</th>
          <th class="px-2 pt-1 pb-1.5 font-normal text-left">Item</th>
          <th class="px-2 pt-1 pb-1.5 font-normal text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-2 py-1 border-y-1 border-neutral-900">{props.selectedGroup.original.category}</td>
          <td class="px-2 py-1 border-y-1 border-neutral-900">{props.selectedGroup.original.item}</td>
          <td class="px-2 py-1 border-y-1 border-neutral-900 text-right">${props.selectedGroup.original.amount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <EditGrid selectedGroup={props.selectedGroup} onsave={props.onsave} />
</Section>