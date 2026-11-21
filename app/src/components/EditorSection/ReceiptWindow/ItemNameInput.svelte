<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    // The current name. It is an empty string when the line item has no name.
    name:string;
    // Receives the trimmed name. An empty name removes the name.
    onsave:(name:string) => void;
    oncancel:() => void;
  }

  let props:Props = $props();

  // The parent makes a new input for each line item, so only the first value of the name is necessary.
  let value:string = $state(untrack(() => props.name));
  let input:HTMLInputElement|undefined = $state();

  $effect(() => {
    input?.select();
  });

  function onKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      props.onsave(value.trim());
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      props.oncancel();
    }
  }
</script>

<input
  class="w-40 px-1 text-sm rounded-md bg-surface-900 pointer-events-auto"
  type="text"
  placeholder="Item name"
  bind:this={input}
  bind:value={value}
  onkeydown={onKeydown}
  onblur={props.oncancel}
/>
