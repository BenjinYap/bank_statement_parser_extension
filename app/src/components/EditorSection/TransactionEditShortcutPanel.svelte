<script lang="ts">
  import Section from "../common/Section.svelte";

  interface Props {
    top?: number;
  }

  let props:Props = $props();

  type Key = {
    label:string;
  };
  type Shortcut = {
    keys:Key[];
    actionName:string;
  }
  const KEY_CTRL:Key = { label: 'Ctrl' };
  const KEY_S:Key = { label: 'S' };
  const KEY_PLUS:Key = { label: '+' };
  const KEY_MINUS:Key = { label: '-' };
  const KEY_SHIFT:Key = { label: 'Shift' };
  const KEY_ENTER:Key = { label: 'Enter' };

  const SHORTCUTS:Shortcut[] = [
    {
      keys: [KEY_CTRL, KEY_PLUS],
      actionName: 'Add new row',
    },
    {
      keys: [KEY_CTRL, KEY_MINUS],
      actionName: 'Split first row',
    },
    {
      keys: [KEY_SHIFT, KEY_ENTER],
      actionName: 'Commit amount without tax',
    },
    {
      keys: [KEY_CTRL, KEY_S],
      actionName: 'Save transaction',
    },
  ];
</script>

<Section
  className="absolute left-[calc(100%+var(--spacing)*4+6px)]"
  style="top: {props.top ?? 0}px;"
  title="Keyboard Shortcuts"
>
  <div class="grid grid-rows-auto grid-cols-[auto_auto] gap-2 items-center">
    {#each SHORTCUTS as shortcut}
      <div class="flex gap-2">
        {#each shortcut.keys as key}
          <div class="rounded-sm bg-surface-800 px-2 py-1 font-mono">{key.label}</div>
        {/each}
      </div>
      <div class="text-nowrap">{shortcut.actionName}</div>
    {/each}
  </div>
</Section>