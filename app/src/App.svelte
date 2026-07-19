<script lang="ts">
  import { mock } from './mock';
  import { parseDom } from './utils/parser';
  import type { TransactionGroup } from './models/TransactionGroup';
  import { createTransactionGroup } from './models/TransactionGroup';
  import EditorSection from './components/EditorSection/EditorSection.svelte';

  const DEV_DATE_FROM = new Date('Sep 10, 2024');

  let transactionGroups:TransactionGroup[]|undefined = $state(undefined);
  let initialSelectedGroup:TransactionGroup|undefined = $state(undefined);

  ;(async () => {
    const dev_mode = !chrome.runtime;

    let html:string = '';
    let dateFrom:Date = DEV_DATE_FROM;

    await new Promise<void>((resolve) => {
      if (!dev_mode) {
        chrome.runtime.onMessage.addListener((req) => {
          if (req.action === 'tab_opened') {
            dateFrom = new Date(req.date_from);
            dateFrom.setHours(0, 0, 0, 0);
            html = req.html;
            resolve();
          }
        });
      } else {
        html = mock;
        setTimeout(resolve, 100);
      }
    });

    const dateTo = new Date();
    dateTo.setHours(-1, 0, 0, 0);

    const parsed = parseDom(html, dateFrom, dateTo);
    const toUse = dev_mode ? parsed.slice(0, 150) : parsed;
    transactionGroups = toUse.map(createTransactionGroup);
    if (dev_mode) {
      initialSelectedGroup = transactionGroups[0];
    }
  })();
</script>

<svelte:head>
  <title>awd</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
</svelte:head>

<div class="max-w-6xl mx-auto w-full py-4">
  {#if transactionGroups === undefined}
    <div class="text-sm text-neutral-400">Loading...</div>
  {:else if transactionGroups.length === 0}
    <div class="text-sm text-neutral-400">No transactions found.</div>
  {:else}
    <EditorSection transactionGroups={transactionGroups} {initialSelectedGroup} />
  {/if}
</div>
