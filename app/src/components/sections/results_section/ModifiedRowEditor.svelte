<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.svelte.js";
  import Button from "../../Button.svelte";
  import Divider from "../../Divider.svelte";

  const CATEGORIES = [
    'Bills',
    'Food',

  ];

  let props = $props();

  let row = $derived(props.row instanceof ParsedRow ? new ModifiedRow(props.row) : ModifiedRow.clone(props.row));
  
  function handleSave() {
    props.onSave(row);
  }
  
  function handleRevert() {
    props.onSave(row.parsed_row);
  }
  
  function handleTaxClick(entry) {
    entry.applied_tax = !entry.applied_tax;
    const tax = 1.13;
    entry.amount = Number((entry.applied_tax ? entry.amount * tax : entry.amount / tax).toFixed(2)); 
  }
</script>

<section class="flex flex-col gap-2 bg-background-950 p-2 rounded-sm bg-white">
  <h2 class="text-lg font-medium">Modify Row</h2>
  <Divider/>
  <h3 class="text-base font-medium">Original Row</h3>
  <Divider/>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th>Item</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{row.parsed_row.date}</td>
        <td>{row.parsed_row.category}</td>
        <td>{row.parsed_row.item}</td>
        <td>{row.parsed_row.amount}</td>
      </tr>
    </tbody>
  </table>
  <h3 class="text-base font-medium">Custom Entries</h3>
  <Divider/>
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
            <input class="w-full" bind:value={entry.item} />
          </td>
          <td>
            <input class="w-full" type="number" bind:value={entry.amount} />
          </td>
          <td class="actions-col">
            <Button
              onclick={() => handleTaxClick(entry)}
              icon="percent"
              color={entry.applied_tax ? 'accent' : ''}
            />
            <Button
              onclick={() => row.entries.push({category:row.entries.at(-1).category, item:'', amount:0.00, applied_tax: true})}
              icon="add"
              color="primary"
            />
            <Button
              onclick={() => row.entries.splice(i, 1)}
              disabled={row.entries.length <= 1}
              icon="delete"
              color="secondary"
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div>
    <Button onclick={handleSave} text="Save" color="primary"/>
    <Button onclick={props.onCancel} text="Cancel" color="secondary"/>
    {#if props.row instanceof ModifiedRow}
      <Button onclick={handleRevert} text="Revert to Original" color="primary"/>
    {/if}
  </div>
</section>