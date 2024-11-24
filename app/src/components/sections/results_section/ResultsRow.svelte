<script>
  let props = $props();
</script>

<tr onclick={() => props.onClick(props.row)}>
  <td>{props.row.date}</td>
  <td>{props.row.category}</td>
  <td class="item {props.row.original_item ? 'replaced' : ''}">
    {props.row.item}
    {#if props.row.original_item}
      {@html `<span class="original">(${props.row.original_item})</span> <span title="Modified by parsing rules" class="material-symbols-outlined">more_horiz</span>`}
    {/if}
  </td>
  <td class="amount">{props.row.amount.toFixed(2)}</td>
</tr>

<style>
  .item {
    display:flex;
    align-items: center;
    border:none;
    gap: calc(var(--gutter) / 2);
  }

  td :global(.original) {
    font-size: 0.8em;
  }

  td :global(.material-symbols-outlined) {
    font-size:1.2em;
    margin-left:auto;
  }

  .replaced {
    background: #d5edff;
  }

  .amount {
    text-align:right;
  }
</style>
