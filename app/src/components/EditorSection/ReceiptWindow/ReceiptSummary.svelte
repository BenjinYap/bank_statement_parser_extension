<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import type { LineItemResult } from '../../../utils/textract';
  import { toEditTransactions } from '../../../utils/receipts/group';
  import Button from '../../common/Button.svelte';
  import Heading from '../../common/Heading.svelte';
  import ReceiptSummaryTable from './ReceiptSummaryTable.svelte';

  interface Props {
    lineItems:LineItemResult[];
    // Maps a line item index to its item name. Line items without a name are not in the map.
    itemNames:Map<number, string>;
    oncancel:() => void;
  }

  let props:Props = $props();

  let rows:EditTransaction[] = $derived(toEditTransactions(props.lineItems, props.itemNames));
</script>

<div class="flex flex-col gap-2 min-w-xs">
  <Heading
    level={2}
  >
    Summary
  </Heading>
  <ReceiptSummaryTable rows={rows} />
  <Button
    variant="primary"
  >
    Apply
  </Button>
  <Button
    variant="unfilled"
    onclick={props.oncancel}
  >
    Cancel
  </Button>
</div>
