<script>
  import Section from "../Section.svelte";
  import ModifiedRowEditor from "./results_section/ModifiedRowEditor.svelte";
  import ResultsRow from "./results_section/ResultsRow.svelte";

  let props = $props();
  let csv = $derived.by(() => {
    let csv = '';
    props.rows?.forEach((r) => {
      csv += `${r.date},${r.category},${r.item},${r.amount}\n`;
    });
    return csv;
  });

  let selected_row = $state();

  $effect(() => {
    if (props.rows && !selected_row) {
      selected_row = props.rows[0];
    }
  })

</script>

<Section title="Parsed Rows">
  <button onclick={() => navigator.clipboard.writeText(csv)}>Copy CSV</button>
  <div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Item</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        {#each props.rows as row}
          <ResultsRow
            row={row}
            onClick={(r) => selected_row = r}
          />
        {/each}
      </tbody>
    </table>
    {#if selected_row}
      <ModifiedRowEditor
        row={selected_row}
      />
    {/if}
  </div>
</Section>

<style>
  button {
    align-self: flex-start;
  }

  div {
    display:flex;
    align-items: flex-start;
    gap: var(--gutter);
  }

  table {
    flex: 1;
  }
</style>
