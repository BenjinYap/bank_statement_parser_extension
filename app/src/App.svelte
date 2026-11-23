<script lang="ts">
  import { mock } from './mock';
  import { applyReplacements, parseDom } from './utils/parser';
  import { toItemReplacements, toRules, type ItemReplacement } from './utils/replacements/items';
  import { loadReplacements, saveReplacements, type Replacements } from './utils/replacements/storage';
  import { recordLineItemNames, type LineItemName } from './utils/replacements/lineItems';
  import type { Rule } from './utils/replacements/engine';
  import type { TransactionGroup } from './models/TransactionGroup';
  import type { ParsedTransaction } from './models/ParsedTransaction';
  import { createTransactionGroup } from './models/TransactionGroup';
  import EditorSection from './components/EditorSection/EditorSection.svelte';
  import ReplacementsSection from './components/ReplacementsSection/ReplacementsSection.svelte';
  import CredentialsWindow from './components/CredentialsWindow/CredentialsWindow.svelte';
  import RowSortingWindow from './components/RowSortingWindow/RowSortingWindow.svelte';

  const DEV_DATE_FROM = new Date('Sep 10, 2024');
  const isDevMode = !chrome.runtime;

  // The rules are empty until they load from S3. The load finishes before buildTransactionGroups runs.
  let itemReplacements:ItemReplacement[] = $state([]);
  const itemRules:Rule[] = $derived(toRules(itemReplacements));
  let categoryRules:Rule[] = $state([]);
  let lineItemNames:LineItemName[] = $state([]);
  let transactionGroups:TransactionGroup[]|undefined = $state(undefined);
  let initialSelectedGroup:TransactionGroup|undefined = $state(undefined);

  // Not $state because only buildTransactionGroups reads these values.
  let html:string = '';
  let dateFrom:Date = DEV_DATE_FROM;
  let dateTo:Date = new Date();

  function buildTransactionGroups() {
    const parsed:ParsedTransaction[] = parseDom(html, dateFrom, dateTo, itemRules, categoryRules);
    const visibleTransactions:ParsedTransaction[] = isDevMode ? parsed.slice(0, 150) : parsed;
    transactionGroups = visibleTransactions.map(createTransactionGroup);
    if (isDevMode) {
      initialSelectedGroup = transactionGroups[0];
    }
  }

  async function applyRules() {
    if (transactionGroups === undefined) {
      return;
    }

    for (const group of transactionGroups) {
      if (group.edited) {
        continue;
      }
      const rawItem:string = group.original.originalItem ?? group.original.item;
      const original:ParsedTransaction = {
        date: group.original.date,
        amount: group.original.amount,
        ...applyReplacements(rawItem, group.original.amount, itemRules, categoryRules),
      };
      group.original = original;
      group.current = [{ ...original }];
    }

    // A new array makes the {#key} block rebuild EditorSection, which clears the selected group.
    initialSelectedGroup = undefined;
    transactionGroups = [...transactionGroups];

    await saveAllReplacements();
  }

  // Saves the Categories and Items tables as they are, including edits that were not applied.
  // Also removes the line item entries that have an empty item name.
  async function saveAllReplacements() {
    // Without this filter, the receipt window fills in an empty name.
    lineItemNames = lineItemNames.filter((entry) => entry.itemName.trim() !== '');
    await saveReplacements({ itemRules, categoryRules, lineItemNames });
  }

  async function recordAndSaveLineItemNames(newEntries:LineItemName[]) {
    lineItemNames = recordLineItemNames(lineItemNames, newEntries);
    await saveAllReplacements();
  }

  function deleteTransactionGroup(group:TransactionGroup) {
    if (transactionGroups === undefined) {
      return;
    }
    const index:number = transactionGroups.indexOf(group);
    if (index === -1) {
      return;
    }
    // splice keeps the same array, so the {#key} block does not rebuild EditorSection.
    transactionGroups.splice(index, 1);
  }

  ;(async () => {
    await new Promise<void>((resolve) => {
      if (!isDevMode) {
        chrome.runtime.onMessage.addListener((req) => {
          if (req.action === 'tab_opened') {
            dateFrom = new Date(req.date_from);
            dateFrom.setHours(0, 0, 0, 0);
            html = req.html;
            console.log(html);
            resolve();
          }
        });
      } else {
        html = mock;
        setTimeout(resolve, 100);
      }
    });

    dateTo = new Date();
    dateTo.setHours(-1, 0, 0, 0);

    // Load after the message listener is registered, so that the app does not miss the tab_opened message.
    const replacements:Replacements = await loadReplacements();
    itemReplacements = toItemReplacements(replacements.itemRules);
    categoryRules = replacements.categoryRules;
    lineItemNames = replacements.lineItemNames;

    buildTransactionGroups();
  })();
</script>

<svelte:head>
  <title>awd</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<div class="max-w-6xl mx-auto w-full py-4 flex flex-col gap-2">
  <div class="flex flex-col gap-2 fixed left-4 top-4 w-[300px]">
    <CredentialsWindow />
    <RowSortingWindow />
  </div>

  <ReplacementsSection
    itemReplacements={itemReplacements}
    categoryRules={categoryRules}
    lineItemNames={lineItemNames}
    onApplyRules={applyRules}
    onSaveLineItemNames={saveAllReplacements}
  />

  {#if transactionGroups === undefined}
    <div class="text-sm text-neutral-400">Loading...</div>
  {:else if transactionGroups.length === 0}
    <div class="text-sm text-neutral-400">No transactions found.</div>
  {:else}
    {#key transactionGroups}
      <EditorSection
        transactionGroups={transactionGroups}
        categoryRules={categoryRules}
        lineItemNames={lineItemNames}
        {initialSelectedGroup}
        onrecordlineitemnames={recordAndSaveLineItemNames}
        ondelete={deleteTransactionGroup}
      />
    {/key}
  {/if}
</div>
