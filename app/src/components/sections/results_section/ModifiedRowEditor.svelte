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
  let category_inputs = $state([]);
  let item_inputs = $state([]);
  let amount_inputs = $state([]);
  // This is an array [x, y] where x is the column and y is the row for
  // tracking the current focused input in the row entries
  let focused_input = null;
  
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
  
  function addNewEntry() {
    row.entries.push({category: row.entries.at(-1).category, item: '', amount: 0.00, applied_tax: true});
  }
  
  // This feels very wrong, but it's an effect to auto focus the last Category select whenever
  // rows are added or removed
  $effect(() => {
    // When a row is removed, the select is replaced with a null in the same spot, that's
    // why I filter by the last element that isn't null to focus instead
    category_inputs.findLast(a => !!a).focus();
  });
  
  function handleAmountKeyUp(e, entry) {
    // Enter key only
    if (e.keyCode !== 13) {
      return;
    }
    
    // If the amount is an equation, eval it
    const amount = entry.amount;
    
    // If shift key, mark as tax applied without applying it for reasons like
    // subtracting an item from a receipt total or something
    if (e.shiftKey) {
      entry.applied_tax = true;
    }
    
    if (String(amount).match(/^=\d+(\.\d+)?([+\-*]\d+(\.\d+)?)*$/)) {
      // TODO: Add error handling
      entry.amount = calculate(amount.substring(1));
    }
    
    // If no shift key, apply tax after the calculation because I'm most likely
    // using math to sum up items from the receipt, which needs to include tax afterwards
    if (!e.shiftKey) {
      handleTaxClick(entry);
    }
  }
  
  // Prevent the the default up/down behavior for input fields because i have excel navigation
  function handleInputKeyDown(e) {
    if ([38, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
  }
  
  // Prevent the browser from handling these browser-specific hotkeys cause i am using them
  function handleBodyKeyDown(e) {
    if (e.ctrlKey) {
      if ([187, 83].includes(e.keyCode)) {
        e.preventDefault();
      }
    }
  }
  
  function handleBodyKeyUp(e) {
    // Handle hotkeys with Ctrl
    if (e.ctrlKey) {
      if (e.keyCode === 187) {  // Ctrl + + to add new entry
        addNewEntry();
      } else if (e.keyCode === 83) {  // Ctrl + S to save
        handleSave();
      }
    } else {
      const focused_x = focused_input[0];
      const focused_y = focused_input[1];
      
      // Handle up and down arrows to switch to the input above or below the current input, like in
      // excel
      if (e.keyCode === 38) {
        if (focused_y > 0) {
          const column_inputs_above = [
            category_inputs[focused_y - 1],
            item_inputs[focused_y - 1],
            amount_inputs[focused_y - 1],
          ];
          column_inputs_above[focused_x].focus();
        }
      } else if (e.keyCode === 40) {
        if (focused_y < row.entries.length - 1) {
          const column_inputs_below = [
            category_inputs[focused_y + 1],
            item_inputs[focused_y + 1],
            amount_inputs[focused_y + 1],
          ];
          column_inputs_below[focused_x].focus();
        }
      }
    }
  }
  
  // Track the current input that just got focused
  function handleFocus(col, row) {
    focused_input = [col, row];
  }
</script>

<svelte:body onkeydown={handleBodyKeyDown} onkeyup={handleBodyKeyUp} />

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
              tabindex="-1"
              class="!p-0"
              onclick={() => row.entries.splice(i, 1)}
              disabled={row.entries.length <= 1}
              icon="close"
              color="error"
            />
          </div>
          <div class="td">
            <select
              bind:value={entry.category}
              bind:this={category_inputs[i]}
              onkeydown={handleInputKeyDown}
              onfocus={() => handleFocus(0, i)}
            >
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
            <input
              class="w-full"
              bind:value={entry.item}
              bind:this={item_inputs[i]}
              onkeydown={handleInputKeyDown}
              onfocus={() => handleFocus(1, i)}
            />
          </div>
          <div class="td text-right">
            <input
              class="w-full text-right"
              bind:value={entry.amount}
              bind:this={amount_inputs[i]}
              onfocus={() => handleFocus(2, i)}
              onkeydown={handleInputKeyDown}
              onkeyup={(e) => handleAmountKeyUp(e, entry)}
              onbeforeinput={() => entry.applied_tax = false}
            />
          </div>
          <div class="td flex items-center justify-center">
            <input
              type="checkbox"
              tabindex="-1"
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
            onclick={addNewEntry}
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