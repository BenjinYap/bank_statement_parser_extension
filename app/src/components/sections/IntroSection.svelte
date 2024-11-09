<script>
  import Section from "../Section.svelte";
  import { getFormattedDate } from "../../utils/date.mjs";

  let props = $props();
</script>

<Section title="Bank Parserinator">
  <p>
    Parse rows from
    {getFormattedDate(props.date_include_left)}
    to
    {getFormattedDate(props.date_include_right)}
    (inclusive)
  </p>
</Section>

<style>
  p {
    margin:0;
  }
</style>
