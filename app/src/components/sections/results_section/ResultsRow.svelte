<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import ResultsRowEntry from "./ResultsRowEntry.svelte";
  import { onMount } from "svelte";

  let props = $props();
  let temp = $derived.by(() => {
    // console.log('aaaaaaaa', props.row);
    if (props.row instanceof ParsedRow) {
      return [{
        date: props.row.date,
        category: props.row.category,
        item: props.row.item,
        amount: props.row.amount,
        original_item: props.row.original_item,
        awdawd: 1,
        is_modified: false,
      }];
    } else {
      return props.row.entries.map((e, i) => {
        return {
          date: props.row.parsed_row.date,
          category: e.category,
          item: e.item,
          amount: e.amount,
          original_item: props.row.parsed_row.original_item,
          is_modified: true,
          is_first_entry: props.row.entries.length > 1 && i === 0,
          is_last_entry: props.row.entries.length > 1 && i === props.row.entries.length - 1,
        };
      });
    }
  });

  let color = $state([255, 255, 255]);
  onMount(() => {
    // color = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
  });
</script>

{#each temp as entry, i}
  <ResultsRowEntry
    onclick={props.onclick}
    {...entry}
    {color}
  />
{/each}

<!--{#if props.row instanceof ParsedRow}-->
<!--  <ResultsRowEntry-->
<!--     onclick={() => props.onClick(props.row)}-->
<!--  />-->
<!--{:else}-->
<!--  {#each props.row.getEntries() as entry}-->
<!--&lt;!&ndash;    <ResultsRowEntry&ndash;&gt;-->

<!--&lt;!&ndash;    />&ndash;&gt;-->
<!--  {/each}-->
<!--{/if}-->


<!--<tr onclick={() => props.onClick(props.row)}>-->
<!--  <td>{props.row.date}</td>-->
<!--  <td>{props.row.category}</td>-->
<!--  <td class="item {props.row.original_item ? 'replaced' : ''}">-->
<!--    {props.row.item}-->
<!--    {#if props.row.original_item}-->
<!--      {@html `<span class="original">(${props.row.original_item})</span> <span title="Modified by parsing rules" class="material-symbols-outlined">more_horiz</span>`}-->
<!--    {/if}-->
<!--  </td>-->
<!--  <td class="amount">{props.row.amount.toFixed(2)}</td>-->
<!--</tr>-->


