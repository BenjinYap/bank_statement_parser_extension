<script lang="ts">
  import Button from '../../common/Button.svelte';

  interface Props {
    oncancel: () => void;
  }

  let props:Props = $props();
</script>

<h1>hello</h1>

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
