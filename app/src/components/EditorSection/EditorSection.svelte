<script lang="ts">
  import type { TransactionGroup } from '../../models/TransactionGroup';
  import type { ParsedTransaction } from '../../models/ParsedTransaction';
  import TransactionTable from './TransactionTable.svelte';
  import TransactionEditPanel from './TransactionEditPanel.svelte';
  import NoTransactionSelected from './NoTransactionSelected.svelte';
  import Section from '../common/Section.svelte';
  import Button from "../common/Button.svelte";

  type Props = {
    transactionGroups: TransactionGroup[];
    initialSelectedGroup?: TransactionGroup;
  };

  let props:Props = $props();

  let selectedGroup:TransactionGroup|undefined = $state(props.initialSelectedGroup);
  let selectedGroupTop:number = $state(0);

  function handleSave(group:TransactionGroup, newTransactions:ParsedTransaction[]) {
    group.current = newTransactions;
    selectedGroup = undefined;
  }

  function handleCopyCsv() {
    let rows = props.transactionGroups.flatMap((group) =>
      group.current.map((transaction) =>
        [transaction.date, transaction.category, transaction.item, transaction.amount].join(',')
      )
    );
    navigator.clipboard.writeText(rows.join('\n'));
  }
</script>

<Section title="Editor">
  <div class="grid grid-rows-[auto] grid-cols-2 gap-2">
    <div class="">
      <Button variant="primary">Hi</Button>
    </div>

    <div class="col-start-1">
      <TransactionTable
        transactionGroups={props.transactionGroups}
        {selectedGroup}
        onselect={(group, topOffset) => { selectedGroup = group; selectedGroupTop = topOffset; }}
      />
    </div>

    <div class="relative">
      {#if selectedGroup === undefined}
        <Section>
          Select a transaction to edit.
        </Section>
      {:else}
        <TransactionEditPanel
          {selectedGroup}
          marginTop={selectedGroupTop}
          onsave={(newTransactions) => handleSave(selectedGroup, newTransactions)}
        />
      {/if}
    </div>

    <div class="">
      <Button
        variant="primary"
        onclick={handleCopyCsv}
      >Copy CSV</Button>
    </div>
  </div>
</Section>
