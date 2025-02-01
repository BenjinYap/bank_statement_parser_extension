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
  <div class="table">
    <div class="thead col-span-4">
      <div class="tr col-span-4">
        <div class="th">Date</div>
        <div class="th">Category</div>
        <div class="th">Item</div>
        <div class="th text-right">Amount</div>
      </div>
    </div>
    <div class="tbody col-span-4">
      <div class="tr col-span-4">
        <div class="td">{row.parsed_row.date}</div>
        <div class="td">{row.parsed_row.category}</div>
        <div class="td">{row.parsed_row.item}</div>
        <div class="td text-right">{row.parsed_row.amount}</div>
      </div>
    </div>
  </div>
  <h3 class="text-base font-medium">Overrides</h3>
  <div class="table">
    <div class="thead col-span-5">
      <div class="tr col-span-5">
        <div class="td">
          <Button
            class="!p-0 invisible"
            icon="close"
            color="error"
          />
        </div>
        <div class="th">Category</div>
        <div class="th">Item</div>
        <div class="th text-right">Amount</div>
        <div class="th text-center">Tax</div>
      </div>
    </div>
    <div class="tbody col-span-5">
      {#each row.entries as entry, i}
        <div class="tr col-span-5">
          <div class="td flex items-center">
            <Button
              class="!p-0"
              onclick={() => row.entries.splice(i, 1)}
              disabled={row.entries.length <= 1}
              icon="close"
              color="error"
            />
          </div>
          <div class="td">
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
          <div class="td">
            <input class="w-full" bind:value={entry.item} />
          </div>
          <div class="td text-right">
            <input class="w-full text-right" type="number" bind:value={entry.amount} />
          </div>
          <div class="td flex items-center justify-center">
            <input
              type="checkbox"
              onchange={() => handleTaxClick(entry)}
              checked={entry.applied_tax}
            />
          </div>
        </div>
      {/each}
      <div class="tr col-span-5">
        <div class="p-0 td border-0 col-span-5">
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
  <Stack direction="row">
    <Button onclick={handleSave} text="Save" color="primary"/>
    <Button onclick={props.onCancel} text="Cancel" color="tertiary"/>
    {#if props.row instanceof ModifiedRow}
      <Button onclick={handleRevert} text="Revert to Original" color="secondary"/>
    {/if}
  </Stack>
</Section>