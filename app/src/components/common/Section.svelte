<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children:Snippet;
    title:string;
    className?:string;
    style?:string;
  }

  let props:Props = $props();
</script>

<section
  class="rounded-md border-6 border-neutral-900 {props.className ?? ''}"
  style={props.style ?? ''}
>
  {#if props.title}
    <div class="text-xl px-2 pb-1.5 bg-neutral-900 text-nowrap">{props.title}</div>
  {/if}
  <div class="p-2">
    {@render props.children()}
  </div>
</section>
