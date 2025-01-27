<script>

  import { ParsedRow } from "../../models/ParsedRow.mjs";
  import Section from "../Section.svelte";
  import ModifiedRowEditor from "./results_section/ModifiedRowEditor.svelte";
  import ResultsRow from "./results_section/ResultsRow.svelte";
  import Button from "../Button.svelte";

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
    <div class="flex flex-col gap-2">
      <Button
        onclick={handleCsvClick}
        color="primary"
        text="Copy CSV"
      />
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
                  is_selected={selected_row_index === i}
                  onclick={() => {selected_row_index = i; console.log(i)}}
                />
              {/key}
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
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
