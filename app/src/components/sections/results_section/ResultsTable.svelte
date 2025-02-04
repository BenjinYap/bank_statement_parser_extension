<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  
  let props = $props();
  
  let rows = $derived.by(() => {
    return props.rows ? props.rows.map((row) => {
      if (row instanceof ParsedRow) {
        return [{
          date: row.date,
          category: row.category,
          item: row.item,
          amount: row.amount,
          original_item: row.original_item,
          is_modified: false,
        }];
      } else {
        return row.entries.map((e, i) => {
          return {
            date: row.parsed_row.date,
            category: e.category,
            item: e.item,
            amount: e.amount,
            original_item: row.parsed_row.original_item,
            is_modified: true,
            // is_first_entry: row.entries.length > 1 && i === 0,
            // is_last_entry: row.entries.length > 1 && i === row.entries.length - 1,
          };
        });
      }
    }) : undefined;
  });
  
  const DEFAULT_ROW_CLASSES = {
    background: 'bg-surface-900',
    selected: 'bg-surface-700',
  };
  const MODIFIED_ROW_CLASSES = {
    background: 'bg-secondary-900',
    selected: 'bg-secondary-700',
  };
</script>

<div class="table">
  <div class="thead col-span-4">
      <div class="tr col-span-4">
        <div class="th">Date</div>
        <div class="th">Category</div>
        <div class="th">Item</div>
        <div class="th text-right">Amount</div>
      </div>
    </div>
  <div class="tbody col-span-4">
    {#if rows === undefined }
      <h1>Loading</h1>
    {:else}
      {#each rows as row, i}
        {#each row as entry}
          {@const row_classes = entry.is_modified ? MODIFIED_ROW_CLASSES : DEFAULT_ROW_CLASSES}
          <div
            onclick={() => props.onclick(i)}
            class="tr col-span-4 {props.selected_row_index === i ? row_classes.selected : row_classes.background} {entry.is_first_entry ? 'first' : ''} {entry.is_last_entry ? 'last' : ''}"
          >
            <div class="td">{entry.date}</div>
            <div class="td">{entry.category}</div>
            <div class="td text-nowrap overflow-hidden text-ellipsis">
              {entry.item}
              {#if entry.original_item}
                {@html `<span class="text-xs">(${entry.original_item})</span>`}
              {/if}
            </div>
            <div class="td text-right">{entry.amount}</div>
          </div>
        {/each}
      {/each}
    {/if}
  </div>
</div>

<style>
  /*noinspection CssInvalidAtRule*/
  @reference '../../../app.css';
  
  .first .td, .last .td {
    position: relative;
  }
  
  .first .td:first-child:before {
    @apply border-t-[0.7em] border-t-surface-700 border-r-[0.7em] border-r-transparent;
    position: absolute;
    top:0;
    left:0;
    width:0;
    height:0;
    content:'';
  }
  
  .first .td:last-child:after {
    @apply border-t-[0.7em] border-t-surface-700 border-l-[0.7em] border-l-transparent;
    position: absolute;
    top:0;
    right:0;
    width:0;
    height:0;
    content:'';
  }
  
  .last .td:first-child:before {
    @apply border-b-[0.7em] border-b-surface-700 border-r-[0.7em] border-r-transparent;
    position: absolute;
    bottom:0;
    left:0;
    width:0;
    height:0;
    content:'';
  }
  
  .last .td:last-child:after {
    @apply border-b-[0.7em] border-b-surface-700 border-l-[0.7em] border-l-transparent;
    position: absolute;
    bottom:0;
    right:0;
    width:0;
    height:0;
    content:'';
  }
</style>