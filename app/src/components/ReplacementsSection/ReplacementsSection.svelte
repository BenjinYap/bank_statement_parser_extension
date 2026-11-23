<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import type { ItemReplacement } from '../../utils/replacements/items';
  import type { LineItemName } from '../../utils/replacements/lineItems';
  import Section from '../common/Section.svelte';
  import CategoriesSection from './CategoriesSection.svelte';
  import ItemsSection from './ItemsSection.svelte';
  import LineItemsSection from './LineItemsSection.svelte';

  type Props = {
    itemReplacements:ItemReplacement[];
    categoryRules:Rule[];
    lineItemNames:LineItemName[];
    onApplyRules:() => void;
    onSaveLineItemNames:() => void;
  };

  let props:Props = $props();
</script>

<Section title="Replacements">
  <div class="flex flex-row gap-2">
    <div class="flex-2">
      <CategoriesSection
        rules={props.categoryRules}
        onApplyRules={props.onApplyRules}
      />
    </div>
    <div class="flex-3">
      <ItemsSection
        itemReplacements={props.itemReplacements}
        onApplyRules={props.onApplyRules}
      />
    </div>
    <div class="flex-2">
      <LineItemsSection
        lineItemNames={props.lineItemNames}
        onSave={props.onSaveLineItemNames}
      />
    </div>
  </div>
</Section>
