<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.svelte.js";
  import IconButton from "../../IconButton.svelte";

  const CATEGORIES = [
    'Bills',
    'Food',

  ];

  let { ...props } = $props();

  // let row = $derived(props.row instanceof ParsedRow ? new ModifiedRow(props.row) : props.row);
  let row = $derived.by(() => {
    const awd = props.row instanceof ParsedRow ? new ModifiedRow(props.row) : props.row;
    console.log('aaa', awd, props.row);
    return awd;
    
  });
  // let entries = $state(row.entries.map((e) => {
  //   return {...e};
  // }));
  // let entries = $derived.by(() => {
  //   const awd = row.entries.map((e) => {
  //     return {...e};
  //   });
  //   return awd;
  // });
  // let entries = [];
  
  function handleSave() {
    // row.entries = $state.snapshot(entries);
    props.onSave(row);
  }
</script>

<section>
  <h2 onclick={() => console.log(JSON.stringify($state.snapshot(row.entries)))}>Modify Row</h2>
  <table>
    <tbody>
      <tr>
        <th onclick={() => row.entries.push({category: 'a', item: 'hu', amount:1})}>Date</th>
        <td>{row instanceof ParsedRow ? row.date : row.parsed_row.date}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{row instanceof ParsedRow ? row.category : row.parsed_row.category}</td>
      </tr>
      <tr>
        <th>Item</th>
        <td>{row instanceof ParsedRow ? row.item : row.parsed_row.item}</td>
      </tr>
      <tr>
        <th>Amount</th>
        <td>{row instanceof ParsedRow ? row.amount : row.parsed_row.amount}</td>
      </tr>
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Item</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each row.entries as entry, i}
        <tr>
          <td>
            <select bind:value={entry.category}>
              {#each CATEGORIES as cat}
                <option
                  value={cat}
                  selected={cat === entry.category}
                >
                  {cat}
                </option>
              {/each}
            </select>
          </td>
          <td>
            <input bind:value={entry.item} />
          </td>
          <td>
            <input type="number" bind:value={entry.amount} />
          </td>
          <td class="actions-col">
            <IconButton
              onclick={() => row.entries.push({category:row.entries.at(-1).category, item:'', amount:0})}
              code="add"
            />
            <IconButton
              onclick={() => row.entries.splice(i, 1)}
              disabled={row.entries.length <= 1}
              code="delete"
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div>
    <button onclick={handleSave}>Save</button>
    <button onclick={props.onCancel}>Cancel</button>
    <button>Revert to Original</button>
  </div>
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

  .actions-col {
    white-space: nowrap;
    cursor: default;
  } 
</style>
