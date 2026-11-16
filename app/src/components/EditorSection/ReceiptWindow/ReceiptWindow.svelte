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

  // Test names for the line items of the mock Textract response, until the naming UI exists.
  // The position of each name is the line item index.
  // Line items 0 and 1 have the same name, so the summary shows one grouped row for them.
  const MOCK_ITEM_NAMES:string[] = ['Drinks for home', 'Drinks for home', 'Halloween costume'];

  let lineItems:LineItemResult[] = $state([]);
  // Maps a line item index to its item name. Line items without a name are not in the map.
  const itemNames:SvelteMap<number, string> = new SvelteMap();

  // The names are keyed by index, so they do not fit new line items.
  function setLineItemsAndClearNames(newLineItems:LineItemResult[]) {
    lineItems = newLineItems;
    itemNames.clear();
    MOCK_ITEM_NAMES.forEach((name, index) => {
      if (index >= newLineItems.length) {
        return;
      }

      itemNames.set(index, name);
    });
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
