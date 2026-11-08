<script lang="ts">
  interface Props {
    text:string;
    disabled:boolean;
    onphoto:(photo:File) => void;
  }

  let props:Props = $props();

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
  class="cursor-pointer bg-primary-600 text-white rounded px-3 py-1.5 hover:bg-primary-500 active:bg-primary-700"
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
