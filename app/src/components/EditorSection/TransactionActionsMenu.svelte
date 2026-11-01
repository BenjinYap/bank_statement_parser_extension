<script lang="ts">
  import TransactionActionsMenuButton from './TransactionActionsMenuButton.svelte';

  interface Props {
    open: boolean;
  }

  let props: Props = $props();
</script>

<div class="flex absolute top-0 left-0 z-1 bg-gray-800 text-nowrap {props.open ? '' : 'hidden'}">
  <TransactionActionsMenuButton
    name="delete"
  />
</div>

<style>

</style>