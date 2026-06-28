<script lang="ts">
  import type { RowGroup } from '../../models/RowGroup';
  import type { ParsedRow } from '../../models/ParsedRow';
  import RowTable from './RowTable.svelte';
  import RowEditPanel from './RowEditPanel.svelte';
  import NoRowSelected from './NoRowSelected.svelte';
  import Section from '../common/Section.svelte';

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

<Section>
  <div class="flex items-start gap-4">
    <RowTable rowGroups={props.rowGroups} {selectedGroup} onselect={(group) => selectedGroup = group} />
    {#if selectedGroup === undefined}
      <NoRowSelected />
    {:else}
      <RowEditPanel
        {selectedGroup}
        onsave={(newRows) => handleSave(selectedGroup, newRows)}
      />
    {/if}
  </div>
</Section>
