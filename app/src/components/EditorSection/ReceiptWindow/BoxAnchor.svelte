<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { BoundingBox } from '@aws-sdk/client-textract';

  interface Props {
    boundingBox:BoundingBox;
    // True when the content must show above the content of all other anchors.
    raised?:boolean;
    children:Snippet;
  }

  let props:Props = $props();

  // Textract gives each bounding box value as a ratio from 0 to 1 of the image size.
  let leftPercent:number = $derived(((props.boundingBox.Left ?? 0) + (props.boundingBox.Width ?? 0)) * 100);
  let topPercent:number = $derived(((props.boundingBox.Top ?? 0) + (props.boundingBox.Height ?? 0) / 2) * 100);
</script>

<!-- Places the content right of the box, centered on the vertical middle of the box. -->
<!-- The content must set pointer-events-auto to get clicks, so that the empty area does not block the boxes. -->
<div
  class="absolute pl-1 -translate-y-1/2 pointer-events-none {props.raised ? 'z-20' : 'z-10'}"
  style="left: {leftPercent}%; top: {topPercent}%;"
>
  {@render props.children()}
</div>
