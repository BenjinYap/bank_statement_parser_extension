<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import Button from '../../common/Button.svelte';
  import Heading from '../../common/Heading.svelte';
  import ReceiptSummaryTable from './ReceiptSummaryTable.svelte';

  interface Props {
    rows:EditTransaction[];
    onsave:() => void;
    onclose:() => void;
  }

  let props:Props = $props();
</script>

<div class="flex flex-col gap-2 min-w-xs">
  <Heading
    level={2}
  >
    Summary
  </Heading>
  <ReceiptSummaryTable rows={props.rows} />
  <Button
    variant="primary"
    className="disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={props.rows.length === 0}
    onclick={props.onsave}
  >
    Save
  </Button>
  <Button
    variant="unfilled"
    onclick={props.onclose}
  >
    Close
  </Button>
</div>
