<script lang="ts">
  import Section from "../common/Section.svelte";

  interface Props {
    top?: number;
  }

  let props:Props = $props();
</script>

<Section
  className="absolute left-[calc(100%+var(--spacing)*4+6px)]"
  style="top: {props.top ?? 0}px;"
  title="Keyboard Shortcuts"
>
  awdawd
</Section>