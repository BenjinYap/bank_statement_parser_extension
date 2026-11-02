<script lang="ts">
  import { tick } from 'svelte';
  import type { Rule } from '../../utils/replacements/engine';
  import Heading from '../common/Heading.svelte';
  import Button from '../common/Button.svelte';

  type Props = {
    rules:Rule[];
    onApplyRules:() => void;
  };

  let props:Props = $props();
  let expanded:boolean = $state(false);
  let replacementInputs:HTMLInputElement[] = $state([]);

  async function addRule() {
    props.rules.push({ pattern: '', comparisons: [], replacement: '' });
    // The input of the new row exists only after Svelte updates the DOM.
    await tick();
    replacementInputs.at(-1)?.focus();
  }
</script>

<div class="flex flex-col gap-2">
  <Heading
    level="2"
    bind:expanded
  >
    Categories
  </Heading>

  {#if expanded}
    <table class="border-3 border-surface-900">
      <thead>
        <tr class="bg-surface-900">
          <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Replacement</th>
          <th class="px-2 pt-1 pb-1.5 font-normal text-left w-[50%]">Pattern</th>
        </tr>
      </thead>
      <tbody>
        {#each props.rules as rule, index}
          <tr>
            <td>
              <input
                type="text"
                class="w-full"
                bind:this={replacementInputs[index]}
                bind:value={rule.replacement}
              />
            </td>
            <td>
              <input
                type="text"
                class="w-full"
                bind:value={rule.pattern}
              />
            </td>
          </tr>
        {/each}
        <tr>
          <td colspan="2">
            <Button
              variant="primary"
              className="rounded-t-none w-full"
              onclick={addRule}
            >
              +
            </Button>
          </td>
        </tr>
      </tbody>
    </table>

    <Button
      variant="primary"
      onclick={props.onApplyRules}
    >
      Apply
    </Button>
  {/if}
</div>
