<script>
  let props = $props();
</script>

<tr onclick={props.onclick} style="background-color:rgb({props.color})">
  <td>{props.awdawd ? 'original' : 'modified'}</td>
  <td>{props.date}</td>
  <td>{props.category}</td>
  <td class="item {props.original_item ? 'replaced' : ''}">
    {props.item}
    {#if props.original_item}
      {@html `<span class="original">(${props.original_item})</span> <span title="Modified by parsing rules" class="material-symbols-outlined">more_horiz</span>`}
    {/if}
  </td>
  <td class="amount">{props.amount.toFixed(2)}</td>
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
