<script>
  let props = $props();
  
  const DIRECTION_CLASSES = {
    row: 'flex-row',
    column: 'flex-col',
  };
</script>

<div class="flex {DIRECTION_CLASSES[props.direction]} gap-2">
  {#if props.children}
    {@render props.children()}
  {/if}
</div>