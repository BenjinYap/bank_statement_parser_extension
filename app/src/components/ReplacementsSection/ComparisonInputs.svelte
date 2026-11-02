<script lang="ts">
  import { OPERATORS, type Comparison, type Operator } from '../../utils/replacements/engine';

  type Props = {
    comparison:Comparison;
  };

  let props:Props = $props();
  let firstValueInput:HTMLInputElement|undefined = $state(undefined);

  const operators:Operator[] = Object.keys(OPERATORS) as Operator[];

  export function focus() {
    firstValueInput?.focus();
  }
</script>

<div class="flex gap-2">
  <select
    class="w-24 shrink-0"
    bind:value={props.comparison.operator}
  >
    {#each operators as operator}
      <option value={operator}>{operator}</option>
    {/each}
  </select>
  <input
    type="number"
    step="any"
    class="min-w-0"
    bind:this={firstValueInput}
    bind:value={props.comparison.values[0]}
  />
  {#if props.comparison.operator === 'between'}
    <input
      type="number"
      step="any"
      class="min-w-0"
      bind:value={props.comparison.values[1]}
    />
  {/if}
</div>
