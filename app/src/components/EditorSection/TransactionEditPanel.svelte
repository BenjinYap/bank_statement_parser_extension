<script lang="ts">
  import type { TransactionGroup } from '../../models/TransactionGroup';
  import type { ParsedTransaction } from '../../models/ParsedTransaction';
  import type { EditTransaction } from '../../models/EditTransaction';
  import { doReplacement, type Rule } from '../../utils/replacements/engine';
  import type { LineItemName } from '../../utils/replacements/lineItems';
  import EditGrid from './EditGrid/EditGrid.svelte';
  import Section from "../common/Section.svelte";
  import Heading from "../common/Heading.svelte";
  import Button from "../common/Button.svelte";
  import ShortcutPanel from "../common/ShortcutPanel.svelte";
  import ReceiptWindow from "./ReceiptWindow/ReceiptWindow.svelte";
  import { KEY_CTRL, KEY_ENTER, KEY_MINUS, KEY_PLUS, KEY_S, KEY_SHIFT, type Shortcut } from "../../utils/shortcuts";

  const SHORTCUTS:Shortcut[] = [
    {
      keys: [KEY_CTRL, KEY_PLUS],
      actionName: 'Add new transaction',
    },
    {
      keys: [KEY_CTRL, KEY_MINUS],
      actionName: 'Subtract from first transaction',
    },
    {
      keys: [KEY_SHIFT, KEY_ENTER],
      actionName: 'Commit amount without tax',
    },
    {
      keys: [KEY_CTRL, KEY_S],
      actionName: 'Save transaction',
    },
  ];

  interface Props {
    selectedGroup: TransactionGroup;
    categoryRules:Rule[];
    lineItemNames:LineItemName[];
    onsave: (newTransactions: ParsedTransaction[]) => void;
    // Receives the line item names from receipt Apply. They are recorded also if the edit is not saved.
    onrecordlineitemnames:(newEntries:LineItemName[]) => void;
  }

  let props:Props = $props();
  let editTransactions:EditTransaction[] = $state([]);
  let receiptWindowOpen:boolean = $state(false);

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

  // Runs only the category rules. The item rules convert raw bank text, and the user types clean item names.
  function applyReceipt(receiptRows:EditTransaction[], namedLineItems:LineItemName[]) {
    props.onrecordlineitemnames(namedLineItems);
    editTransactions = receiptRows.map((row) => ({
      ...row,
      category: doReplacement(row.item, row.amount, props.categoryRules) ?? '',
    }));
    receiptWindowOpen = false;
  }

  function handleKeydown(event:KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }

    if (event.key === 's') {
      event.preventDefault();
      save();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="sticky top-2">
  <Section title="Edit Transaction">
    <div class="flex flex-col gap-2">
      <Heading level={2}>Original Transaction</Heading>

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

      <Heading level={2}>Granular Transactions</Heading>

      <EditGrid editTransactions={editTransactions} />

      <Button
        variant="primary"
        onclick={() => {
          receiptWindowOpen = true;
        }}
      >
        Scan Receipt
      </Button>

      <Button
        variant="primary"
        onclick={save}
      >
        Save
      </Button>
    </div>
  </Section>

  <div class="absolute top-0 left-[calc(100%+var(--spacing)*4+6px)]">
    <ShortcutPanel shortcuts={SHORTCUTS} />
  </div>

  {#if receiptWindowOpen}
    <ReceiptWindow
      lineItemNames={props.lineItemNames}
      onapply={applyReceipt}
      onclose={() => {
        receiptWindowOpen = false;
      }}
    />
  {/if}
</div>