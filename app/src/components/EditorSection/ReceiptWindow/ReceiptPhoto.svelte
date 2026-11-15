<script lang="ts">
  import type { LineItemResult } from '../../../utils/textract';
  import LineItemOverlay from './LineItemOverlay.svelte';

  interface Props {
    photoUrl:string;
    lineItems:LineItemResult[];
  }

  let props:Props = $props();

  let selectedIndex:number|undefined = $state(undefined);
</script>

<!-- This div must not scroll. If it scrolls, the SVG uses the visible height, not the image height. -->
<div class="relative">
  <img
    src={props.photoUrl}
    alt="Receipt"
    class="w-full"
  />

  <!-- Textract gives each bounding box value as a ratio from 0 to 1 of the image size. The viewBox uses the same range. -->
  <svg
    class="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1 1"
    preserveAspectRatio="none"
  >
    {#each props.lineItems as lineItem, index}
      <LineItemOverlay
        lineItem={lineItem}
        selected={index === selectedIndex}
        onselect={() => { selectedIndex = index; }}
      />
    {/each}
  </svg>
</div>
