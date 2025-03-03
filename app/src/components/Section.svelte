<script>
  import Button from "./Button.svelte";
  
  let props = $props();
  let expandable = props.expanded !== undefined;
  let expanded = $state(props.expanded);
</script>

<section class="border-surface-700 border-2 rounded-sm {props.class}">
  <div class="p-2 bg-surface-800 flex gap-2 items-center">
    <h1 class="text-lg font-medium">{props.title}</h1>
    {#if expandable}
      <Button
        class="!p-0"
        onclick={() => expanded = !expanded}
        icon={expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        color="tertiary"
      />
    {/if}
  </div>
  {#if !expandable || expanded}
    <div class="bg-surface-900 border-t-2 border-t-surface-700 flex flex-col gap-2 p-2">
      {#if props.children}
        {@render props.children()}
      {/if}
    </div>
  {/if}
</section>