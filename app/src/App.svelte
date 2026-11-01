<script lang="ts">
  import { mock } from './mock';
  import { parseDom } from './utils/parser';
  import { ITEM_RULES, CATEGORY_RULES } from './utils/replacements/rules';
  import type { Rule } from './utils/replacements/engine';
  import type { TransactionGroup } from './models/TransactionGroup';
  import type { ParsedTransaction } from './models/ParsedTransaction';
  import { createTransactionGroup } from './models/TransactionGroup';
  import EditorSection from './components/EditorSection/EditorSection.svelte';
  import ReplacementsSection from './components/ReplacementsSection/ReplacementsSection.svelte';

  const DEV_DATE_FROM = new Date('Sep 10, 2024');
  const isDevMode = !chrome.runtime;

  let itemRules:Rule[] = $state(structuredClone(ITEM_RULES));
  let categoryRules:Rule[] = $state(structuredClone(CATEGORY_RULES));
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

    buildTransactionGroups();
  })();
</script>

<svelte:head>
  <title>awd</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<div class="max-w-6xl mx-auto w-full py-4 flex flex-col gap-2">
  <ReplacementsSection
    itemRules={itemRules}
    categoryRules={categoryRules}
    onApplyRules={buildTransactionGroups}
  />

  {#if transactionGroups === undefined}
    <div class="text-sm text-neutral-400">Loading...</div>
  {:else if transactionGroups.length === 0}
    <div class="text-sm text-neutral-400">No transactions found.</div>
  {:else}
    {#key transactionGroups}
      <EditorSection
        transactionGroups={transactionGroups}
        {initialSelectedGroup}
        ondelete={deleteTransactionGroup}
      />
    {/key}
  {/if}
</div>
