<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import Section from '../common/Section.svelte';
  import Button from '../common/Button.svelte';
  import ShortcutPanel from '../common/ShortcutPanel.svelte';
  import CategoriesTable from './CategoriesTable.svelte';
  import { portal } from '../../utils/portal';
  import { registerShortcutScope, type Shortcut } from '../../utils/shortcuts';

  type Props = {
    rules:Rule[];
    onapply:(rules:Rule[]) => Promise<void>;
    onclose:() => void;
  };

  let props:Props = $props();

  // The popup edits a copy, so Close discards the edits. Only Apply gives the rules to the parent.
  let rules:Rule[] = $state($state.snapshot(props.rules));

  // The scope is empty, but it still makes the editor shortcuts inactive while the popup is open.
  const SHORTCUTS:Shortcut[] = [];

  $effect(() => registerShortcutScope(SHORTCUTS));

  async function apply() {
    await props.onapply(rules);
    props.onclose();
  }
</script>

<div
  class="fixed inset-0 z-10 flex items-center justify-center p-2 bg-black/70"
  use:portal
>
  <!-- The wrapper is the anchor of the shortcut panel. The popup alone stays at the center of the screen. -->
  <div class="relative flex flex-col w-full max-w-xl max-h-full">
    <Section
      title="Category replacements"
      className="flex flex-col min-h-0 bg-surface-950"
      bodyClassName="flex flex-col flex-1 min-h-0 gap-2"
    >
      <CategoriesTable rules={rules} />

      <div class="flex gap-2">
        <Button
          className="w-full"
          variant="primary"
          onclick={apply}
        >
          Apply
        </Button>
        <Button
          className="w-full"
          variant="unfilled"
          onclick={props.onclose}
        >
          Close
        </Button>
      </div>
    </Section>

    <div class="absolute top-1/2 left-[calc(100%+var(--spacing)*2)] -translate-y-1/2 rounded-md bg-surface-950">
      <ShortcutPanel shortcuts={SHORTCUTS} />
    </div>
  </div>
</div>
