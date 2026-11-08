<script lang="ts">
  import type { BoundingBox } from '@aws-sdk/client-textract';
  import type { LineItemResult } from '../../../utils/textract';

  interface Props {
    photoUrl:string;
    lineItems:LineItemResult[];
  }

  let props:Props = $props();

  let boundingBoxes:BoundingBox[] = $derived(
    props.lineItems.flatMap((lineItem) => [lineItem.item.boundingBox, lineItem.price.boundingBox])
  );

  // Textract gives each bounding box value as a ratio from 0 to 1 of the image size.
  function toPercent(ratio:number|undefined):string {
    return `${(ratio ?? 0) * 100}%`;
  }
</script>

<div class="relative w-fit">
  <img
    src={props.photoUrl}
    alt="Receipt"
    class="block max-h-[80vh] max-w-full"
  />

  {#each boundingBoxes as boundingBox}
    <div
      class="absolute border-2 border-red-500 pointer-events-none"
      style:left={toPercent(boundingBox.Left)}
      style:top={toPercent(boundingBox.Top)}
      style:width={toPercent(boundingBox.Width)}
      style:height={toPercent(boundingBox.Height)}
    ></div>
  {/each}
</div>
