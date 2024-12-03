<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.svelte.js";

  const CATEGORIES = [
    'Bills',
    'Food',

  ];

  let { ...props } = $props();

  let row = $derived(props.row instanceof ParsedRow ? new ModifiedRow(props.row) : props.row);
  let entries = $state(row.entries.map((e) => {
    return {...e};
  }));

  function handleSave() {
    row.entries = $state.snapshot(entries);
    props.onSave(row);
  }
</script>

<section>
  <h2 onclick={() => console.log(entries)}>Modify Row</h2>
  <table>
    <tbody>
      <tr>
        <th onclick={() => entries.push({category: 'a', item: 'hu', amount:1})}>Date</th>
        <td>{row.date}</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{row.category}</td>
      </tr>
      <tr>
        <th>Item</th>
        <td>{row.item}</td>
      </tr>
      <tr>
        <th>Amount</th>
        <td>{row.amount}</td>
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
      {#each entries as entry, i}
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
            <span
              class="material-symbols-outlined"
              onclick={() => entries.push({category:'', item:'', amount:0})}
            >
              add
            </span>
            <span
              class="material-symbols-outlined"
              onclick={() => entries.splice(i, 1)}
            >
              delete
            </span>
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
  }
</style>
