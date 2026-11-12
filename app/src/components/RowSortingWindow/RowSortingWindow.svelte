<script lang="ts">
  import Section from '../common/Section.svelte';
  import Button from '../common/Button.svelte';
  import { sortRows } from './rowSorting';

  let expanded:boolean = $state(false);
  let csv:string = $state('');

  function handleSort() {
    csv = sortRows(csv.split('\n')).join('\n');
  }
</script>

<Section
  title="Row Sorting"
  bind:expanded
>
  <div class="flex flex-col gap-2">
    <textarea
      class="resize-none"
      rows="20"
      bind:value={csv}
    ></textarea>

    <div class="flex gap-2">
      <Button
        className="w-full"
        variant="primary"
        onclick={handleSort}
      >
        Sort
      </Button>
      <Button
        className="w-full"
        variant="unfilled"
        onclick={() => expanded = false}
      >
        Close
      </Button>
    </div>
  </div>
</Section>
