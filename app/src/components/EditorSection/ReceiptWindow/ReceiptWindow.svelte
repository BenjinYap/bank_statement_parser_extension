<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import type { LineItemResult } from '../../../utils/textract';
  import Section from '../../common/Section.svelte';
  import ReceiptEditor from './ReceiptEditor.svelte';
  import ReceiptSummary from './ReceiptSummary.svelte';

  interface Props {
    onclose: () => void;
  }

  let props:Props = $props();

  let lineItems:LineItemResult[] = $state([]);
  // Maps a line item index to its item name. Line items without a name are not in the map.
  const itemNames:SvelteMap<number, string> = new SvelteMap();

  // The names are keyed by index, so they do not fit new line items.
  function setLineItemsAndClearNames(newLineItems:LineItemResult[]) {
    lineItems = newLineItems;
    itemNames.clear();
  }

  // An empty name removes the name.
  function setItemName(index:number, name:string) {
    if (name === '') {
      itemNames.delete(index);
      return;
    }

    itemNames.set(index, name);
  }
</script>

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
        onlineitemschange={setLineItemsAndClearNames}
      />
      <ReceiptSummary
        lineItems={lineItems}
        itemNames={itemNames}
        oncancel={props.onclose}
      />
    </div>
  </Section>
</div>
