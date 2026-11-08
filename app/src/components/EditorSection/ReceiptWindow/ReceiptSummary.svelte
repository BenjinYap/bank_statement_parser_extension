<script lang="ts">
  import Button from '../../common/Button.svelte';
  import Heading from '../../common/Heading.svelte';

  interface Props {
    oncancel: () => void;
  }

  let props:Props = $props();
</script>

<div class="flex flex-col gap-2">
  <Heading
    level={2}
  >
    Summary
  </Heading>
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