<script>
  import Section from "../Section.svelte";
  import Button from "../Button.svelte";
  
  let props = $props();
</script>

<Section title="Settings">
  <h3 class="text-base font-medium">Category Replacements</h3>
  <div class="table">
    <div class="thead col-span-3">
      <div class="tr col-span-3">
        <div class="th"></div>
        <div class="th">Set Category to</div>
        <div class="th">If Item Contains</div>
      </div>
    </div>
    <div class="tbody col-span-3">
      {#each props.settings.category_replacements as repl}
        <div class="tr col-span-3">
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
        </div>
      {/each}
    </div>
  </div>
</Section>