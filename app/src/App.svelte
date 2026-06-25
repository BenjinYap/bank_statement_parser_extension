<script lang="ts">
  import { mock } from './mock'
  import { parseDom } from './utils/parser'
  import type { ParsedRow } from './models/ParsedRow'

  const DEV_DATE_FROM = new Date('Sep 10, 2024')

  let rows: ParsedRow[] | undefined = $state(undefined)

  ;(async () => {
    const dev_mode = !chrome.runtime

    let html: string = ''
    let dateFrom: Date = DEV_DATE_FROM

    await new Promise<void>((resolve) => {
      if (!dev_mode) {
        chrome.runtime.onMessage.addListener((req) => {
          if (req.action === 'tab_opened') {
            dateFrom = new Date(req.date_from)
            dateFrom.setHours(0, 0, 0, 0)
            html = req.html
            resolve()
          }
        })
      } else {
        html = mock
        setTimeout(resolve, 100)
      }
    })

    const dateTo = new Date()
    dateTo.setHours(-1, 0, 0, 0)

    const parsed = parseDom(html, dateFrom, dateTo)
    rows = dev_mode ? parsed.slice(0, 5) : parsed
  })()
</script>

<div class="flex flex-col items-stretch gap-2 py-2 max-w-[1000px] w-full">
  {#if rows === undefined}
    <div class="text-sm text-gray-500">Loading...</div>
  {:else if rows.length === 0}
    <div class="text-sm text-gray-500">No transactions found.</div>
  {:else}
    <div class="grid grid-cols-[auto_auto_1fr_auto] gap-x-6 gap-y-1 text-sm">
      <div class="font-semibold text-gray-600">Date</div>
      <div class="font-semibold text-gray-600">Category</div>
      <div class="font-semibold text-gray-600">Item</div>
      <div class="font-semibold text-gray-600 text-right">Amount</div>
      {#each rows as row}
        <div class="tabular-nums">{row.date}</div>
        <div>{row.category}</div>
        <div>{row.item}</div>
        <div class="text-right tabular-nums">${row.amount.toFixed(2)}</div>
      {/each}
    </div>
  {/if}
</div>
