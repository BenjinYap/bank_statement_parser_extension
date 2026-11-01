<script lang="ts">
  interface Props {
    name: string;
    onclick: () => void;
  }

  let props:Props = $props();
</script>

<span
  class="material-symbols-outlined text-xl! leading-[1] hover:bg-purple-700"
  onclick={props.onclick}
>
  {props.name}
</span>