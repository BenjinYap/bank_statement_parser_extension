<script>
  import Divider from "./Divider.svelte";
  
  let props = $props();
</script>

<section class="border-surface-700 border-2 rounded-sm {props.class}">
  <div class="p-2 border-b-2 bg-surface-800 border-b-surface-700">
    <h1 class="text-lg font-medium">{props.title}</h1>
  </div>
  <div class="bg-surface-900 flex flex-col gap-2 p-2">
    {#if props.children}
      {@render props.children()}
    {/if}
  </div>
</section>