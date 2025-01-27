<script>
  import Divider from "./Divider.svelte";
  
  let props = $props();
</script>

<section class="flex flex-col gap-2 bg-background-950 p-2 rounded-sm">
  <h1 class="text-lg font-medium">{props.title}</h1>
  <Divider />
  {#if props.children}
    {@render props.children()}
  {/if}
</section>