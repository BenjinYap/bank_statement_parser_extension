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
  // A hovered or selected line item hides the names of the other line items, also when it has no name.
  let showAllNames:boolean = $derived(hoveredIndex === undefined && selectedIndex === undefined);

  // Moves the input to the next unnamed line item, so that the user can name the whole receipt with the keyboard.
  // The parent gives the name to the other line items with the same text first, so the search skips them.
  function saveName(index:number, name:string) {
    props.onname(index, name);
    selectedIndex = findNextUnnamedIndex(index);
  }

  // The search goes back to the top after the last line item. It does not return the start index.
  // Returns undefined when all other line items have a name.
  function findNextUnnamedIndex(startIndex:number):number|undefined {
    const count:number = props.lineItems.length;
    for (let offset:number = 1; offset < count; offset++) {
      const index:number = (startIndex + offset) % count;
      if (!props.itemNames.has(index)) {
        return index;
      }
    }

    return undefined;
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
    {:else if props.itemNames.has(index) && (showAllNames || index === hoveredIndex)}
      <BoxAnchor
        boundingBox={lineItem.item.boundingBox}
        raised={index === hoveredIndex}
      >
        <span class="border-l-1 border-black px-1.5 text-sm bg-surface-900 whitespace-nowrap">{props.itemNames.get(index)}</span>
      </BoxAnchor>
    {/if}
  {/each}
</div>
