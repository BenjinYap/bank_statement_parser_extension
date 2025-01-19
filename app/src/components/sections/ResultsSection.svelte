<script>

  import { ParsedRow } from "../../models/ParsedRow.mjs";
  import Section from "../Section.svelte";
  import ModifiedRowEditor from "./results_section/ModifiedRowEditor.svelte";
  import ResultsRow from "./results_section/ResultsRow.svelte";

  let props = $props();
  // let csv = $derived.by(() => {
  //   let csv = '';
  //   props.rows?.forEach((r) => {
  //     csv += `${r.date},${r.category},${r.item},${r.amount}\n`;
  //   });
  //   return csv;
  // });

  let rows = $derived(props.rows);
  let selected_row_index = $state(-1);

  $effect(() => {
    if (rows && selected_row_index === -1) {
      selected_row_index = 0;
    }
  })

  function handleModifiedRowEditorSave(index, modified_row) {
    rows.splice(index, 1, modified_row);
    selected_row_index = -1;
  }
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
        {#if rows === undefined }
          <h1>Loading</h1>
        {:else}
          {#each rows as row, i}
            {#key row}
              <ResultsRow
                row={row}
                onclick={() => {selected_row_index = i; console.log(i)}}
              />
            {/key}
          {/each}
        {/if}
      </tbody>
    </table>
    {#if selected_row_index !== -1}
      <ModifiedRowEditor
        row={rows[selected_row_index]}
        onSave={(r) => handleModifiedRowEditorSave(selected_row_index, r)}
        onCancel={() => selected_row_index = -1}
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
