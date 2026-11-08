<script lang="ts">
  interface Props {
    text:string;
    disabled:boolean;
    onphoto:(photo:File) => void;
  }

  let props:Props = $props();

  let colorClass:string = $derived(props.disabled ? 'bg-surface-600 pointer-events-none' : 'bg-primary-600');

  function handleChange(event:Event & { currentTarget:HTMLInputElement }) {
    const input:HTMLInputElement = event.currentTarget;
    const photo:File|undefined = input.files?.[0];
    // Clear the input, so that the next photo causes a change event too.
    input.value = '';
    if (photo === undefined) {
      return;
    }

    props.onphoto(photo);
  }
</script>

<label
  class="flex items-center justify-center w-full max-w-md h-48 p-6 rounded-3xl text-3xl font-semibold text-center text-white {colorClass}"
>
  {props.text}
  <input
    type="file"
    accept="image/*"
    capture="environment"
    class="hidden"
    disabled={props.disabled}
    onchange={handleChange}
  />
</label>
