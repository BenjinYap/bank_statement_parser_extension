<script>

  import { ParsedRow } from "../../models/ParsedRow.mjs";
  import Section from "../Section.svelte";
  import ModifiedRowEditor from "./results_section/ModifiedRowEditor.svelte";
  import ResultsRow from "./results_section/ResultsRow.svelte";
  import Button from "../Button.svelte";
  import ResultsTable from "./results_section/ResultsTable.svelte";

  let props = $props();
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
  
  function handleResultsTableRowClick(index) {
    selected_row_index = index;
  }
  
  function handleCsvClick() {
    let csv = '';
    rows.forEach((r) => {
      if (r instanceof ParsedRow) {
        csv += `${r.date},${r.category},${r.item},${r.amount}\n`;
      } else {
        r.entries.forEach((a) => {
          csv += `${r.parsed_row.date},${a.category},${a.item},${a.amount}\n`;
        });
      }
    });
    navigator.clipboard.writeText(csv);
  }
</script>

<Section title="Parsed Rows">
  <div class="flex flex-row gap-2">
    <div class="flex flex-col gap-2 max-w-1/2 flex-auto">
      <Button
        onclick={handleCsvClick}
        color="primary"
        text="Re-parse Original Data"
      />
      <ResultsTable
        selected_row_index={selected_row_index}
        onclick={handleResultsTableRowClick}
        rows={rows}
      />
      <Button
        onclick={handleCsvClick}
        color="secondary"
        text="Copy CSV"
      />
    </div>
    {#if selected_row_index !== -1}
      <div class="max-w-1/2 flex-auto">
        <ModifiedRowEditor
          row={rows[selected_row_index]}
          onSave={(r) => handleModifiedRowEditorSave(selected_row_index, r)}
          onCancel={() => selected_row_index = -1}
        />
      </div>
    {/if}
  </div>
</Section>

<style>
  /*button {*/
  /*  align-self: flex-start;*/
  /*}*/
  
  /*div {*/
  /*  display:flex;*/
  /*  align-items: flex-start;*/
  /*  gap: var(--gutter);*/
  /*}*/
  
  /*table {*/
  /*  flex: 1;*/
  /*}*/
</style>
