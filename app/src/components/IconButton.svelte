<script>
  let props = $props();
</script>

<button
  type="button"
  onclick={props.onclick}
  disabled={props.disabled}
>
  <span
    class="material-symbols-outlined"
  >
    {props.code}
  </span>
</button>

<style>
  button {
    background:transparent;
    border:none;
    margin:0;
    padding:0;
  }
  
  button:not([disabled]) span {
    cursor: pointer;
  }
  
  span {
    vertical-align: middle;
  }
</style>