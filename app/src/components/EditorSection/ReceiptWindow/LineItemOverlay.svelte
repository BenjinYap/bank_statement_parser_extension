<script lang="ts">
  import type { BoundingBox } from '@aws-sdk/client-textract';
  import type { LineItemResult } from '../../../utils/textract';

  interface Props {
    lineItem:LineItemResult;
    selected:boolean;
    onselect:() => void;
  }

  let props:Props = $props();

  type Box = { left:number, top:number, width:number, height:number };

  function toBox(boundingBox:BoundingBox):Box {
    return {
      left: boundingBox.Left ?? 0,
      top: boundingBox.Top ?? 0,
      width: boundingBox.Width ?? 0,
      height: boundingBox.Height ?? 0,
    };
  }

  let item:Box = $derived(toBox(props.lineItem.item.boundingBox));
  let price:Box = $derived(toBox(props.lineItem.price.boundingBox));

  const SELECTED_CLASSES = { box: 'fill-gray-800/50', line: 'stroke-gray-800' };
  const UNSELECTED_CLASSES = {
    box: 'fill-gray-500/30 group-hover:fill-gray-600/40',
    line: 'stroke-gray-500 group-hover:stroke-gray-600',
  };

  let colorClasses:{ box:string, line:string } = $derived(props.selected ? SELECTED_CLASSES : UNSELECTED_CLASSES);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<g
  class="group pointer-events-auto cursor-pointer"
  onclick={props.onselect}
>
  {#each [item, price] as box}
    <rect
      class={colorClasses.box}
      x={box.left}
      y={box.top}
      width={box.width}
      height={box.height}
    />
  {/each}
  <!-- The non-scaling stroke keeps the line width at 2 screen pixels, although the viewBox is 0 to 1. -->
  <line
    class="stroke-2 [vector-effect:non-scaling-stroke] {colorClasses.line}"
    x1={item.left + item.width}
    y1={item.top + item.height / 2}
    x2={price.left}
    y2={price.top + price.height / 2}
  />
</g>
