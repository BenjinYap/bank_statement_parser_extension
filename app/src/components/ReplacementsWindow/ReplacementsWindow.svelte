<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import type { ItemReplacement } from '../../utils/replacements/items';
  import type { LineItemName } from '../../utils/replacements/lineItems';
  import Section from '../common/Section.svelte';
  import Button from '../common/Button.svelte';
  import CategoriesPopup from './CategoriesPopup.svelte';
  import ItemsPopup from './ItemsPopup.svelte';
  import LineItemsPopup from './LineItemsPopup.svelte';

  type Props = {
    categoryRules:Rule[];
    itemReplacements:ItemReplacement[];
    lineItemNames:LineItemName[];
    onApplyCategoryRules:(rules:Rule[]) => Promise<void>;
    onApplyItemReplacements:(itemReplacements:ItemReplacement[]) => Promise<void>;
    onApplyLineItemNames:(lineItemNames:LineItemName[]) => Promise<void>;
  };

  let props:Props = $props();
  let categoriesOpen:boolean = $state(false);
  let itemsOpen:boolean = $state(false);
  let lineItemsOpen:boolean = $state(false);
</script>

<Section title="Replacements">
  <div class="flex flex-col gap-2">
    <Button
      className="w-full"
      variant="primary"
      onclick={() => categoriesOpen = true}
    >
      Categories
    </Button>
    <Button
      className="w-full"
      variant="primary"
      onclick={() => itemsOpen = true}
    >
      Items
    </Button>
    <Button
      className="w-full"
      variant="primary"
      onclick={() => lineItemsOpen = true}
    >
      Receipt line items
    </Button>
  </div>
</Section>

{#if categoriesOpen}
  <CategoriesPopup
    rules={props.categoryRules}
    onapply={props.onApplyCategoryRules}
    onclose={() => categoriesOpen = false}
  />
{/if}

{#if itemsOpen}
  <ItemsPopup
    itemReplacements={props.itemReplacements}
    onapply={props.onApplyItemReplacements}
    onclose={() => itemsOpen = false}
  />
{/if}

{#if lineItemsOpen}
  <LineItemsPopup
    lineItemNames={props.lineItemNames}
    onapply={props.onApplyLineItemNames}
    onclose={() => lineItemsOpen = false}
  />
{/if}
