<script lang="ts">
  // The panel has no position. The caller puts the panel in a positioned element.
  import type { Shortcut } from '../../utils/shortcuts';
  import Section from './Section.svelte';

  type Props = {
    shortcuts:Shortcut[];
  };

  let props:Props = $props();
</script>

<Section title="Keyboard Shortcuts">
  {#if props.shortcuts.length === 0}
    <div class="text-nowrap">No shortcuts</div>
  {:else}
    <div class="grid grid-rows-auto grid-cols-[auto_auto] gap-2 items-center">
      {#each props.shortcuts as shortcut}
        <div class="flex gap-2">
          {#each shortcut.keys as key}
            <div class="rounded-sm bg-surface-800 px-2 py-1 font-mono">{key.label}</div>
          {/each}
        </div>
        <div class="text-nowrap">{shortcut.actionName}</div>
      {/each}
    </div>
  {/if}
</Section>
