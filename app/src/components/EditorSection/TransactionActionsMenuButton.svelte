<script lang="ts">
  interface Props {
    name: string;
    onclick: (event:MouseEvent) => void;
  }

  let props:Props = $props();
</script>

<span
  class="material-symbols-outlined rounded-xs text-xl! leading-[1] hover:bg-primary-500 active:bg-primary-700 cursor-pointer"
  onclick={props.onclick}
>
  {props.name}
</span>