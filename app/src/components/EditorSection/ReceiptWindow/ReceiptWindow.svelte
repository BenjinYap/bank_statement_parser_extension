<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import type { EditTransaction } from '../../../models/EditTransaction';
  import type { LineItemResult } from '../../../utils/textract';
  import { findItemName, isSameLineItem, type LineItemName } from '../../../utils/replacements/lineItems';
  import Section from '../../common/Section.svelte';
  import BlockEditorShortcuts from '../../common/BlockEditorShortcuts.svelte';
  import ReceiptEditor from './ReceiptEditor.svelte';
  import ReceiptSummary from './ReceiptSummary.svelte';

  interface Props {
    // Fills in the item names of line items that were named on an earlier receipt.
    lineItemNames:LineItemName[];
    // Receives one row for each item name. The category of each row is empty.
    // Also receives the text and the item name of each named line item.
    onapply:(rows:EditTransaction[], namedLineItems:LineItemName[]) => void;
    onclose: () => void;
  }

  let props:Props = $props();

  let lineItems:LineItemResult[] = $state([]);
  // Maps a line item index to its item name. Line items without a name are not in the map.
  const itemNames:SvelteMap<number, string> = new SvelteMap();

  // The names are keyed by index, so they do not fit new line items. The known names are filled in again.
  function setLineItemsAndFillNames(newLineItems:LineItemResult[]) {
    lineItems = newLineItems;
    itemNames.clear();
    newLineItems.forEach((lineItem, index) => {
      const itemName:string|undefined = findItemName(props.lineItemNames, lineItem.item.text);
      if (itemName === undefined) {
        return;
      }

      itemNames.set(index, itemName);
    });
  }

  // The name goes to all line items with the same text, also the line items that already have a name.
  // An empty name removes the name from all of them.
  function setItemName(index:number, name:string) {
    const text:string = lineItems[index].item.text;
    lineItems.forEach((lineItem, otherIndex) => {
      if (!isSameLineItem(lineItem.item.text, text)) {
        return;
      }

      if (name === '') {
        itemNames.delete(otherIndex);
      } else {
        itemNames.set(otherIndex, name);
      }
    });
  }

  function apply(rows:EditTransaction[]) {
    const namedLineItems:LineItemName[] = Array.from(itemNames, ([index, itemName]) => ({
      lineItem: lineItems[index].item.text,
      itemName,
    }));
    props.onapply(rows, namedLineItems);
  }
</script>

<BlockEditorShortcuts />

<div class="fixed inset-0 z-10 flex items-center justify-center p-2 bg-black/70">
  <Section
    title="Scan Receipt"
    className="flex flex-col h-full bg-surface-950"
    bodyClassName="flex flex-col flex-1 min-h-0"
  >
    <div class="flex gap-2 flex-1 min-h-0">
      <ReceiptEditor
        itemNames={itemNames}
        onname={setItemName}
        onlineitemschange={setLineItemsAndFillNames}
      />
      <ReceiptSummary
        lineItems={lineItems}
        itemNames={itemNames}
        onapply={apply}
        oncancel={props.onclose}
      />
    </div>
  </Section>
</div>
