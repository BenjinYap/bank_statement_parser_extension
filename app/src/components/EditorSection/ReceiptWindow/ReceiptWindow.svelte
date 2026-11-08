<script lang="ts">
  import Section from '../../common/Section.svelte';
  import ReceiptEditor from './ReceiptEditor.svelte';
  import ReceiptSummary from './ReceiptSummary.svelte';

  interface Props {
    onclose: () => void;
  }

  let props:Props = $props();
</script>

<div class="fixed inset-0 z-10 flex items-center justify-center p-2 bg-black/70">
  <Section
    title="Scan Receipt"
    className="flex flex-col h-full bg-surface-950"
  >
    <div class="flex gap-2">
      <ReceiptEditor />
      <ReceiptSummary oncancel={props.onclose} />
    </div>
  </Section>
</div>
