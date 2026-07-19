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

  let tableContainerEl:HTMLDivElement|undefined = $state();
  let panelEl:HTMLDivElement|undefined = $state();
  let tableHeight:number = $state(0);
  let panelHeight:number = $state(0);

  // The maximum value of marginTop so the EditPanel never goes past the bottom of the page
  let clampedMarginTop:number = $derived.by(() => {
    const maxTop = tableHeight - panelHeight;
    if (maxTop < 0) {
      return 0;
    }
    return Math.min(selectedGroupTop, maxTop);
  });

  $effect(() => {
    if (tableContainerEl === undefined || panelEl === undefined) {
      return;
    }

    // Everytime the EditPanel changes, start recording size changes.
    // The observer also triggers once immediately. The observer is needed because
    // the EditPanel may change height from adding more rows.
    const table = tableContainerEl;
    const panel = panelEl;
    const observer = new ResizeObserver(() => {
      tableHeight = table.offsetHeight;
      panelHeight = panel.offsetHeight;
    });
    observer.observe(table);
    observer.observe(panel);

    return () => observer.disconnect();
  });

  function handleSave(group:TransactionGroup, newTransactions:ParsedTransaction[]) {
    group.current = newTransactions;
    group.edited = true;
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

    <div
      class="col-start-1"
      bind:this={tableContainerEl}
    >
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
        <div bind:this={panelEl}>
          <TransactionEditPanel
            {selectedGroup}
            marginTop={clampedMarginTop}
            onsave={(newTransactions) => handleSave(selectedGroup, newTransactions)}
          />
        </div>
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
