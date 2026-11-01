<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import Section from '../common/Section.svelte';
  import CategoriesSection from './CategoriesSection.svelte';
  import ItemsSection from './ItemsSection.svelte';

  type Props = {
    itemRules:Rule[];
    categoryRules:Rule[];
    onApplyRules:() => void;
  };

  let props:Props = $props();
</script>

<Section title="Replacements">
  <div class="flex flex-row gap-2">
    <div class="flex-1">
      <CategoriesSection
        rules={props.categoryRules}
        onApplyRules={props.onApplyRules}
      />
    </div>
    <div class="flex-1">
      <ItemsSection
      />
    </div>
  </div>
</Section>
