<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import Section from '../common/Section.svelte';
  import Button from '../common/Button.svelte';
  import CategoriesPopup from './CategoriesPopup.svelte';

  type Props = {
    categoryRules:Rule[];
    onApplyCategoryRules:(rules:Rule[]) => Promise<void>;
  };

  let props:Props = $props();
  let categoriesOpen:boolean = $state(false);
</script>

<Section title="Replacements">
  <Button
    className="w-full"
    variant="primary"
    onclick={() => categoriesOpen = true}
  >
    Categories
  </Button>
</Section>

{#if categoriesOpen}
  <CategoriesPopup
    rules={props.categoryRules}
    onapply={props.onApplyCategoryRules}
    onclose={() => categoriesOpen = false}
  />
{/if}
