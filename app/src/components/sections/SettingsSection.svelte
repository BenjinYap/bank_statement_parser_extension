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
      {#each Object.entries(props.settings.category_replacements) as [category, matches]}
        <div class="tr col-span-3">
          <div class="td flex items-center">
            <Button
              class="!p-0"
              onclick
              disabled
              icon="close"
              color="error"
            />
          </div>
          <div class="td">
            <input class="w-full" value={category} />
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
          </div>
          <div class="td">
            <input class="w-full" value={category} />
          </div>
        </div>
      {/each}
    </div>
  </div>
</Section>