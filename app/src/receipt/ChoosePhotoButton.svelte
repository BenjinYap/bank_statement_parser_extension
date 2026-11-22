<script lang="ts">
  import Button from '../components/common/Button.svelte';

  interface Props {
    // Is not called if the user cancels the camera.
    onchoose:(photo:File) => void;
  }

  let props:Props = $props();

  let input:HTMLInputElement|undefined = $state(undefined);

  function handleChange(event:Event & { currentTarget:HTMLInputElement }) {
    const target:HTMLInputElement = event.currentTarget;
    const photo:File|undefined = target.files?.[0];
    // Clear the input, so that the next photo causes a change event too.
    target.value = '';
    if (photo === undefined) {
      return;
    }

    props.onchoose(photo);
  }
</script>

<Button
  variant="primary"
  type="button"
  onclick={() => input?.click()}
>
  Choose Photo
</Button>
<input
  bind:this={input}
  type="file"
  accept="image/*"
  capture="environment"
  class="hidden"
  onchange={handleChange}
/>
