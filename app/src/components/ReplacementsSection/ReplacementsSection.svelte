<script lang="ts">
  import type { Rule } from '../../utils/replacements/engine';
  import Section from '../common/Section.svelte';

  type Props = {
    itemRules:Rule[];
    categoryRules:Rule[];
    onApplyRules:() => void;
  };

  let props:Props = $props();
</script>

<Section title="Replacements">
awd
</Section>
