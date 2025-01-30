<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.svelte.js";
  import Button from "../../Button.svelte";
  import Divider from "../../Divider.svelte";
  import Section from "../../Section.svelte";
  import Stack from "../../Stack.svelte";

  const CATEGORIES = [
    'Bills',
    'Food',
    'Bbobbly flay',
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

<Section title="Modify Row">
  <h3 class="text-base font-medium">Original</h3>
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
  <h3 class="text-base font-medium">Overrides</h3>
  <div class="flex flex-col border p-1 gap-1">
    <div class="border p-1">
      <div class="flex p-1 border gap-1">
        <div class="border px-1 bg-surface-700">
          <Button
            class="!p-0 invisible"
            icon="close"
            color="error"
          />
        </div>
        <div class="border px-1">Category</div>
        <div class="border px-1">Item</div>
        <div class="border px-1">Amount</div>
        <div class="border px-1 text-center">Tax</div>
      </div>
    </div>
    <div class="border p-1">
      {#each row.entries as entry, i}
        <div class="flex p-1 border gap-1">
          <div class="border px-1">
            <Button
              class="!p-0"
              onclick={() => row.entries.splice(i, 1)}
              disabled={row.entries.length <= 1}
              icon="close"
              color="error"
            />
          </div>
          <div class="border px-1">
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
          </div>
          <div class="border px-1">
            <input class="w-full" bind:value={entry.item} />
          </div>
          <div class="border px-1">
            <input class="w-full" type="number" bind:value={entry.amount} />
          </div>
          <div class="border px-1 text-center">
            <input
              type="checkbox"
              onchange={() => handleTaxClick(entry)}
              checked={entry.applied_tax}
            />
          </div>
        </div>
      {/each}
      <div>
        <div class="p-0 border-0" colspan="5">
          <Button
            class="w-full rounded-t-none"
            color="secondary"
            text="Add"
            onclick={() => row.entries.push({category:row.entries.at(-1).category, item:'', amount:0.00, applied_tax: true})}
          />
        </div>
      </div>
    </div>
  </div>
<!--  <table>-->
<!--    <thead>-->
<!--      <tr>-->
<!--        <th class="bg-surface-700"></th>-->
<!--        <th>Category</th>-->
<!--        <th>Item</th>-->
<!--        <th>Amount</th>-->
<!--        <th class="text-center">Tax</th>-->
<!--      </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--      {#each row.entries as entry, i}-->
<!--        <tr>-->
<!--          <td class="px-1">-->
<!--            <Button-->
<!--              class="!p-0"-->
<!--              onclick={() => row.entries.splice(i, 1)}-->
<!--              disabled={row.entries.length <= 1}-->
<!--              icon="close"-->
<!--              color="error"-->
<!--            />-->
<!--          </td>-->
<!--          <td class="px-1">-->
<!--            <select bind:value={entry.category}>-->
<!--              {#each CATEGORIES as cat}-->
<!--                <option-->
<!--                  value={cat}-->
<!--                  selected={cat === entry.category}-->
<!--                >-->
<!--                  {cat}-->
<!--                </option>-->
<!--              {/each}-->
<!--            </select>-->
<!--          </td>-->
<!--          <td class="px-1">-->
<!--            <input class="w-full" bind:value={entry.item} />-->
<!--          </td>-->
<!--          <td class="px-1">-->
<!--            <input class="w-full" type="number" bind:value={entry.amount} />-->
<!--          </td>-->
<!--          <td class="px-1 text-center">-->
<!--            <input-->
<!--              type="checkbox"-->
<!--              onchange={() => handleTaxClick(entry)}-->
<!--              checked={entry.applied_tax}-->
<!--            />-->
<!--          </td>-->
<!--        </tr>-->
<!--      {/each}-->
<!--      <tr>-->
<!--        <td class="p-0 border-0" colspan="5">-->
<!--          <Button-->
<!--            class="w-full rounded-t-none"-->
<!--            color="secondary"-->
<!--            text="Add"-->
<!--            onclick={() => row.entries.push({category:row.entries.at(-1).category, item:'', amount:0.00, applied_tax: true})}-->
<!--          />-->
<!--        </td>-->
<!--      </tr>-->
<!--    </tbody>-->
<!--  </table>-->
  <Stack direction="row">
    <Button onclick={handleSave} text="Save" color="primary"/>
    <Button onclick={props.onCancel} text="Cancel" color="tertiary"/>
    {#if props.row instanceof ModifiedRow}
      <Button onclick={handleRevert} text="Revert to Original" color="secondary"/>
    {/if}
  </Stack>
</Section>