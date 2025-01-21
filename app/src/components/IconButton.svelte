<script>
  let props = $props();
</script>

<button
  type="button"
  onclick={props.onclick}
  disabled={props.disabled}
  style="color: {props.color || 'black'}"
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
    border-radius:var(--border-radius);
  }
  
  button:not([disabled]):hover {
    background:#dedede;
  }
  
  button:not([disabled]) span {
    cursor: pointer;
  }
  
  button[disabled] {
    opacity: 0.2;
  }
  
  span {
    vertical-align: middle;
  }
</style>