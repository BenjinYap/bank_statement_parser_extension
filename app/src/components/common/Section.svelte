<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from './IconButton.svelte';

  interface Props {
    children:Snippet;
    title:string;
    className?:string;
    style?:string;
    expanded?:boolean;
  }

  // The section shows the toggle only when the parent binds `expanded`.
  let { expanded = $bindable(), ...props }:Props = $props();
</script>

<section
  class="rounded-md border-6 border-neutral-900 {props.className ?? ''}"
  style={props.style ?? ''}
>
  {#if props.title}
    <div class="flex items-center gap-2 text-xl px-2 pb-1.5 bg-neutral-900 text-nowrap">
      {props.title}
      {#if expanded !== undefined}
        <IconButton
          name={expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
          onclick={() => {
            expanded = !expanded;
          }}
        />
      {/if}
    </div>
  {/if}
  {#if expanded !== false}
    <div class="p-2">
      {@render props?.children()}
    </div>
  {/if}
</section>
