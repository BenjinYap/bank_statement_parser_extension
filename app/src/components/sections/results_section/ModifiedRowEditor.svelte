<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.mjs";

  let { ...props } = $props();

  let row = $derived(props.row instanceof ParsedRow ? new ModifiedRow(props.row) : props.row);
</script>

<section>
  <h2>Modify Row</h2>
  <table>
    <tbody>
      <tr>
        <th>Date</th>
        <td>{row.getDate()}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{row.getCategory()}</td>
      </tr>
      <tr>
        <th>Item</th>
        <td>{row.getItem()}</td>
      </tr>
      <tr>
        <th>Amount</th>
        <td>{row.getAmount()}</td>
      </tr>
    </tbody>
  </table>
</section>

<style>
  section {
    flex: 1;
    padding:10px;
    background:white;
    border:1px solid #c3c3c3;
    border-radius:var(--border-radius);
    display:flex;
    flex-direction: column;
    gap: var(--gutter);
  }

  h2 {
    font-size: 1.1em;
    font-weight:600;
    margin:0;
    border-bottom:1px solid black;
  }
</style>
