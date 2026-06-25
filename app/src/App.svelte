<script lang="ts">
  import { mock } from './mock';
  import { parseDom } from './utils/parser';
  import type { ParsedRow } from './models/ParsedRow';
  import RowTable from './components/RowTable.svelte';
  import RowEditPanel from './components/RowEditPanel.svelte';

  const DEV_DATE_FROM = new Date('Sep 10, 2024');

  let rows:ParsedRow[]|undefined = $state(undefined);
  let selectedRow:ParsedRow|undefined = $state(undefined);

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
    rows = dev_mode ? parsed.slice(0, 5) : parsed;
  })()
</script>

<div class="flex items-start gap-4 py-2 w-full">
  {#if rows === undefined}
    <div class="text-sm text-gray-500">Loading...</div>
  {:else if rows.length === 0}
    <div class="text-sm text-gray-500">No transactions found.</div>
  {:else}
    <RowTable {rows} {selectedRow} onselect={(row) => selectedRow = row} />
    <RowEditPanel {selectedRow} />
  {/if}
</div>
