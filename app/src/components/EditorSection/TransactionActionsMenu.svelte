<script lang="ts">
  import TransactionActionsMenuButton from './TransactionActionsMenuButton.svelte';

  interface Props {
    open: boolean;
    ondelete: () => void;
  }

  let props: Props = $props();

  function handleDelete(event:MouseEvent) {
    // If the click reaches the row, the row click handler selects the deleted group.
    event.stopPropagation();
    props.ondelete();
  }
</script>

<div class="flex absolute top-0 left-0 z-1 bg-gray-800 text-nowrap {props.open ? '' : 'hidden'}">
  <TransactionActionsMenuButton
    name="delete"
    onclick={handleDelete}
  />
</div>

<style>

</style>