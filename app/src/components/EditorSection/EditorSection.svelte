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
    ondelete: (group:TransactionGroup) => void;
  };

  let props:Props = $props();

  let selectedGroup:TransactionGroup|undefined = $state(props.initialSelectedGroup);

  function handleSave(group:TransactionGroup, newTransactions:ParsedTransaction[]) {
    group.current = newTransactions;
    group.edited = true;
    selectedGroup = undefined;
  }

  function handleDelete(group:TransactionGroup) {
    // The actions menu opens only on the selected group, so the selection is always the deleted group.
    selectedGroup = undefined;
    props.ondelete(group);
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
        onselect={(group) => { selectedGroup = group; }}
        ondelete={handleDelete}
      />
    </div>

    <div>
      {#if selectedGroup === undefined}
        <Section>
          Select a transaction to edit.
        </Section>
      {:else}
        <TransactionEditPanel
          {selectedGroup}
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
