<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import RowTable from './RowTable.svelte';
  import RowEditPanel from './RowEditPanel.svelte';
  import NoRowSelected from './NoRowSelected.svelte';
  import Section from '../common/Section.svelte';
  import Button from "../common/Button.svelte";

  type Props = {
    rowGroups: RowGroup[];
    initialSelectedGroup?: RowGroup;
  };

  let props:Props = $props();

  let selectedGroup:RowGroup|undefined = $state(props.initialSelectedGroup);

  function handleSave(group:RowGroup, newRows:ParsedRow[]) {
    group.current = newRows;
    selectedGroup = undefined;
  }
</script>

<Section title="Editor">
  <div class="grid grid-rows-[auto] grid-cols-2 gap-2">
    <div class="">
      <Button variant="primary">Hi</Button>
    </div>

    <div class="col-start-1">
      <RowTable
        rowGroups={props.rowGroups}
        {selectedGroup}
        onselect={(group) => selectedGroup = group}
      />
    </div>

    <div>
      {#if selectedGroup === undefined}
        <Section>
          Select a transaction to edit.
        </Section>
      {:else}
        <RowEditPanel
          {selectedGroup}
          onsave={(newRows) => handleSave(selectedGroup, newRows)}
        />
      {/if}
    </div>

    <div class="">
      <Button variant="primary">Hi</Button>
    </div>
  </div>
</Section>
