<script>
  let props = $props();
</script>

<tr
  onclick={props.onclick}
  class="{props.is_selected ? 'bg-surface-700' : ''} {props.is_first_entry ? 'first' : ''} {props.is_last_entry ? 'last' : ''}"
>
  <td>{props.date}</td>
  <td>{props.category}</td>
  <td>
    {props.item}
    {#if props.original_item}
      {@html `<span class="text-xs">(${props.original_item})</span>`}
    {/if}
  </td>
  <td class="text-right">{props.amount.toFixed(2)}</td>
</tr>

<style>
  @reference '../../../app.css';
  
  .first td, .last td {
    position: relative;
  }
  
  .first td:first-child:before {
    @apply border-t-[0.7em] border-t-surface-700 border-r-[0.7em] border-r-transparent;
    position: absolute;
    top:0;
    left:0;
    width:0;
    height:0;
    content:'';
  }
  
  .first td:last-child:after {
    @apply border-t-[0.7em] border-t-surface-700 border-l-[0.7em] border-l-transparent;
    position: absolute;
    top:0;
    right:0;
    width:0;
    height:0;
    content:'';
  }
  
  .last td:first-child:before {
    @apply border-b-[0.7em] border-b-surface-700 border-r-[0.7em] border-r-transparent;
    position: absolute;
    bottom:0;
    left:0;
    width:0;
    height:0;
    content:'';
  }
  
  .last td:last-child:after {
    @apply border-b-[0.7em] border-b-surface-700 border-l-[0.7em] border-l-transparent;
    position: absolute;
    bottom:0;
    right:0;
    width:0;
    height:0;
    content:'';
  }
</style>
