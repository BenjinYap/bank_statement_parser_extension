<script lang="ts">
  import type { ItemReplacement } from '../../utils/replacements/items';
  import Section from '../common/Section.svelte';
  import Button from '../common/Button.svelte';
  import ShortcutPanel from '../common/ShortcutPanel.svelte';
  import ItemsTable from './ItemsTable.svelte';
  import { portal } from '../../utils/portal';
  import { KEY_CTRL, KEY_ESCAPE, KEY_S, registerShortcutScope, type Shortcut } from '../../utils/shortcuts';

  type Props = {
    itemReplacements:ItemReplacement[];
    onapply:(itemReplacements:ItemReplacement[]) => Promise<void>;
    onclose:() => void;
  };

  let props:Props = $props();

  // The popup edits a copy, so Close discards the edits. Only Save gives the replacements to the parent.
  let itemReplacements:ItemReplacement[] = $state($state.snapshot(props.itemReplacements));

  // The scope also makes the editor shortcuts inactive while the popup is open.
  const SHORTCUTS:Shortcut[] = [
    {
      keys: [KEY_CTRL, KEY_S],
      actionName: 'Save',
      action: save,
    },
    {
      keys: [KEY_ESCAPE],
      actionName: 'Close',
      action: () => props.onclose(),
    },
  ];

  $effect(() => registerShortcutScope(SHORTCUTS));

  async function save() {
    await props.onapply(itemReplacements);
    props.onclose();
  }
</script>

<div
  class="fixed inset-0 z-10 flex items-center justify-center p-2 bg-black/70"
  use:portal
>
  <!-- The wrapper is the anchor of the shortcut panel. The popup alone stays at the center of the screen. -->
  <div class="relative flex flex-col w-full max-w-4xl max-h-full">
    <Section
      title="Item replacements"
      className="flex flex-col min-h-0 bg-surface-950"
      bodyClassName="flex flex-col flex-1 min-h-0 gap-2"
    >
      <ItemsTable itemReplacements={itemReplacements} />

      <div class="flex gap-2">
        <Button
          className="w-full"
          variant="primary"
          onclick={save}
        >
          Save
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
