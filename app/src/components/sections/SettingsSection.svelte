<script>
  import Section from "../Section.svelte";
  import Button from "../Button.svelte";
  
  let props = $props();
  let adding_new = $state(false);
  let new_value_to_add = $state(null);
  let new_input = $state(undefined);
  
  // Shitty effect to auto focus the new input
  $effect(() => {
    new_input?.focus();
  });
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
          </div>
          <div class="td flex items-center">
            {#each matches as match}
              {#if match === null}
                <input
                  bind:this={new_input}
                  onkeydown={(e) => {
                    // Add the new value on Enter key and non-empty
                    if (e.code === 'Enter' && new_input.value) {
                      new_value_to_add = new_input.value;
                      matches.splice(-1, 1, new_input.value);
                    } else if (e.code === 'Escape') {
                      // Cancel if Escape key
                      new_input.blur();
                    }
                  }}
                  onblur={() => {
                    // Weird logic to detect whether we blurred because we don't want to add a new
                    // value or because we hit Enter and the input is getting removed
                    if (!new_value_to_add) {
                      matches.splice(-1, 1);
                    } else {
                      new_value_to_add = null;
                    }
                    adding_new = false;
                  }}
                />
              {:else}
                <div class="flex items-center gap-1 mr-2 py-1 px-1 rounded-sm bg-surface-700 text-nowrap">
                  {match}
                  <Button
                    class="!p-0 text-xs"
                    onclick={() => {
                      matches.splice(matches.indexOf(match), 1);
                    }}
                    icon="close"
                    color="error"
                  />
                </div>
              {/if}
            {/each}
            {#if !adding_new}
              <Button
                class="!p-0"
                onclick={() => {
                  adding_new = true;
                  matches.push(null);
                }}
                icon="add"
                color="secondary"
              />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</Section>