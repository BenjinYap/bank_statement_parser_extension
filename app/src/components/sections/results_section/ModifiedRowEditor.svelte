<script>
  import { ParsedRow } from "../../../models/ParsedRow.mjs";
  import { ModifiedRow } from "../../../models/ModifiedRow.svelte.js";
  import Button from "../../Button.svelte";
  import Section from "../../Section.svelte";
  import Stack from "../../Stack.svelte";
  import { calculate } from "../../../utils/calculator.mjs";

  const CATEGORIES = [
    'Electronics',
    'Food',
    'Transportation',
    'Video Games',
    'Travel',
    'Office Supplies',
    'Pay',
    'Bills',
    'Health',
    'Books',
    'Subscriptions',
    'Furniture',
    'Collectibles',
    'Clothing',
    'Home',
    'Investments',
    'Hobbies',
    'Kitchen',
    'Eunice',
    'Haniya',
    'Board games',
    'Tranportation',
    'Yuzu',
  ].sort();

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
  
  function handleSplitClick(split_count) {
    for (let i = row.entries.length; i < split_count; i++) {
      row.entries.push({
        category:row.entries[0].category,
        item:'',
        amount:0.00,
        applied_tax: true,
      });
    }
  }
  
  function handleAmountKeyUp(e, entry) {
    // Enter key only
    if (e.keyCode !== 13) {
      return;
    }
    
    // If the amount is an equation, eval it
    const amount = entry.amount;
    if (String(amount).match(/^=\d+(\.\d+)?([+\-*]\d+(\.\d+)?)*$/)) {
      // I'm a bad boy
      entry.amount = calculate(amount.substring(1));
    }
  }
</script>

<Section
  class="sticky top-2"
  title="Modify Row"
>
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
  {#if !(props.row instanceof ModifiedRow)}
    <Stack direction="row">
      <Button color="secondary" onclick={() => handleSplitClick(2)} disabled={row.entries.length >= 2} text="Split x2"/>
      <Button color="secondary" onclick={() => handleSplitClick(3)} disabled={row.entries.length >= 3} text="Split x3"/>
      <Button color="secondary" onclick={() => handleSplitClick(4)} disabled={row.entries.length >= 4} text="Split x4"/>
      <Button color="secondary" onclick={() => handleSplitClick(5)} disabled={row.entries.length >= 5} text="Split x5"/>
    </Stack>
  {/if}
  <h3 class="text-base font-medium">Overrides</h3>
  <div class="table">
    <div class="thead col-span-5">
      <div class="tr col-span-5">
        <div class="th"></div>
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
            <input
              class="w-full text-right"
              bind:value={entry.amount}
              onkeyup={(e) => handleAmountKeyUp(e, entry)}
              onbeforeinput={() => entry.applied_tax = false}
            />
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
        <div class="th col-span-3 text-right">Total</div>
        <div class="th text-right">{Number(row.entries.reduce((acc, obj) => Number(acc) + Number(obj.amount), 0)).toFixed(2)}</div>
      </div>
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