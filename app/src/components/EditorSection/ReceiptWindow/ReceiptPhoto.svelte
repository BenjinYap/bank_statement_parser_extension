<script lang="ts">
  import type { LineItemResult } from '../../../utils/textract';
  import LineItemOverlay from './LineItemOverlay.svelte';
  import BoxAnchor from './BoxAnchor.svelte';
  import ItemNameInput from './ItemNameInput.svelte';

  interface Props {
    photoUrl:string;
    lineItems:LineItemResult[];
    // Maps a line item index to its item name. Line items without a name are not in the map.
    itemNames:Map<number, string>;
    // Receives an empty name when the user removes the name.
    onname:(index:number, name:string) => void;
  }

  let props:Props = $props();

  // The item name input shows next to the selected line item.
  let selectedIndex:number|undefined = $state(undefined);
  let hoveredIndex:number|undefined = $state(undefined);

  // Moves the input to the next line item, so that the user can name the whole receipt with the keyboard.
  function saveName(index:number, name:string) {
    props.onname(index, name);
    const nextIndex:number = index + 1;
    selectedIndex = nextIndex < props.lineItems.length ? nextIndex : undefined;
  }

  // A blur from an input that already closed must not close the input of another line item.
  function cancelName(index:number) {
    if (selectedIndex !== index) {
      return;
    }

    selectedIndex = undefined;
  }

  // A late mouseleave from one line item must not clear the hover of another line item.
  function endHover(index:number) {
    if (hoveredIndex !== index) {
      return;
    }

    hoveredIndex = undefined;
  }
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
        named={props.itemNames.has(index)}
        onselect={() => { selectedIndex = index; }}
        onhoverstart={() => { hoveredIndex = index; }}
        onhoverend={() => endHover(index)}
      />
    {/each}
  </svg>

  {#each props.lineItems as lineItem, index}
    {#if index === selectedIndex}
      <BoxAnchor boundingBox={lineItem.item.boundingBox}>
        <ItemNameInput
          name={props.itemNames.get(index) ?? ''}
          onsave={(name) => saveName(index, name)}
          oncancel={() => cancelName(index)}
        />
      </BoxAnchor>
    {:else if index === hoveredIndex && props.itemNames.has(index)}
      <BoxAnchor boundingBox={lineItem.item.boundingBox}>
        <span class="px-1 text-sm rounded-md bg-surface-900 whitespace-nowrap">{props.itemNames.get(index)}</span>
      </BoxAnchor>
    {/if}
  {/each}
</div>
