<script lang="ts">
  import { mock } from './mock';
  import { parseDom } from './utils/parser';
  import type { RowGroup } from './models/RowGroup';
  import { createRowGroup } from './models/RowGroup';
  import type { ParsedRow } from './models/ParsedRow';
  import RowTable from './components/RowTable.svelte';
  import RowEditPanel from './components/RowEditPanel.svelte';
  import NoRowSelected from './components/NoRowSelected.svelte';

  const DEV_DATE_FROM = new Date('Sep 10, 2024');

  let rowGroups:RowGroup[]|undefined = $state(undefined);
  let selectedGroup:RowGroup|undefined = $state(undefined);

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
    const toUse = dev_mode ? parsed.slice(0, 15) : parsed;
    rowGroups = toUse.map(createRowGroup);
    if (dev_mode) {
      selectedGroup = rowGroups[0];
    }
  })();

  function handleSave(group:RowGroup, newRows:ParsedRow[]) {
    group.current = newRows;
    selectedGroup = undefined;
  }
</script>

<div class="max-w-6xl mx-auto w-full px-4 py-4">
  {#if rowGroups === undefined}
    <div class="text-sm text-neutral-400">Loading...</div>
  {:else if rowGroups.length === 0}
    <div class="text-sm text-neutral-400">No transactions found.</div>
  {:else}
    <div class="flex items-start gap-4">
      <RowTable {rowGroups} {selectedGroup} onselect={(group) => selectedGroup = group} />
      {#if selectedGroup === undefined}
        <NoRowSelected />
      {:else}
        <RowEditPanel
          {selectedGroup}
          onsave={(newRows) => handleSave(selectedGroup!, newRows)}
        />
      {/if}
    </div>
  {/if}
</div>
