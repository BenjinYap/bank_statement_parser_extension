<script>
  import Section from "../Section.svelte";
  import { getFormattedDate } from "../../utils/date.mjs";

  let props = $props();
</script>

<Section title="Parsed Meta">
  {#each props.table_stats as stats}
    <table>
      <tbody>
        <tr>
          <th colspan="4">{stats.label}</th>
        </tr>
        <tr class="success">
          <th>Success Rows</th>
          <td colspan="4">{stats.success_rows.length}</td>
        </tr>

        {#if stats.error_rows.length > 0}
          <tr>
            <th colspan="4">Error Rows</th>
          </tr>
          {#each stats.error_rows as row}
            <tr>
              <td>{row.date}</td>
              <td>{row.item}</td>
              <td>{row.amount}</td>
              <td>{row.error}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  {/each}
</Section>

<style>
  .success th {
    width: 1px;
    white-space: nowrap;
  }
</style>
