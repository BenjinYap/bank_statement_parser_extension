<script>
  let props = $props();
</script>

<tr
  onclick={props.onclick}
  class="{props.is_first_entry ? 'first' : ''} {props.is_last_entry ? 'last' : ''}"
  style="background-color:rgb({props.color})"
>
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
  .first td, .last td {
    position: relative;
  }
  
  .first td:first-child:before {
    position: absolute;
    top:0;
    left:0;
    width:0;
    height:0;
    border-top: var(--gutter) solid #c3c3c3;
    border-right: var(--gutter) solid transparent;
    content:'';
  }
  
  .first td:last-child:after {
    position: absolute;
    top:0;
    right:0;
    width:0;
    height:0;
    border-top: var(--gutter) solid #c3c3c3;
    border-left: var(--gutter) solid transparent;
    content:'';
  }
  
  .last td:first-child:before {
    position: absolute;
    bottom:0;
    left:0;
    width:0;
    height:0;
    border-bottom: var(--gutter) solid #c3c3c3;
    border-right: var(--gutter) solid transparent;
    content:'';
  }
  
  .last td:last-child:after {
    position: absolute;
    bottom:0;
    right:0;
    width:0;
    height:0;
    border-bottom: var(--gutter) solid #c3c3c3;
    border-left: var(--gutter) solid transparent;
    content:'';
  }
  
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
