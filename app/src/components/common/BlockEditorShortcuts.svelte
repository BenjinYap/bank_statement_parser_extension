<script lang="ts">
  // With Ctrl, these keys are shortcuts of the edit panel and the edit grid.
  const BLOCKED_SHORTCUT_KEYS = ['s', '+', '=', '-'];

  // The capture phase runs before the keydown listeners of the edit panel and the edit grid.
  function blockShortcuts(event:KeyboardEvent) {
    if (!event.ctrlKey || !BLOCKED_SHORTCUT_KEYS.includes(event.key)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }
</script>

<svelte:window onkeydowncapture={blockShortcuts} />
