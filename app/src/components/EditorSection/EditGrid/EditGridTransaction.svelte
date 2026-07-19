<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import { CATEGORIES } from '../../../utils/categories';
  import { evaluate } from 'mathjs';

  interface Props {
    transaction: EditTransaction;
    autofocus?: boolean;
  }

  let props:Props = $props();
  let amountText:string = $state(props.transaction.amount.toString());
  let categorySelect:HTMLSelectElement|undefined = $state();

  $effect(() => {
    amountText = props.transaction.amount.toString();
  });

  $effect(() => {
    if (props.autofocus && categorySelect) {
      categorySelect.focus();
    }
  });

  // Only allow digits, decimals, whitespace, brackets, and the +, -, * operators.
  const ARITHMETIC_ONLY:RegExp = /^[\d\s.+\-*()]+$/;

  function parseAmount(text:string):number {
    if (text.startsWith('=')) {
      const formula:string = text.slice(1);
      if (!ARITHMETIC_ONLY.test(formula)) {
        return 0;
      }
      try {
        const result:unknown = evaluate(formula);
        return typeof result === 'number' && isFinite(result) ? result : 0;
      } catch {
        return 0;
      }
    }
    return parseFloat(text) || 0;
  }

  function commitAmount() {
    props.transaction.amount = parseAmount(amountText);
    amountText = props.transaction.amount.toString();
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      commitAmount();
    }
  }
</script>

<tr>
  <td class="">
    <select
      class=""
      bind:this={categorySelect}
      bind:value={props.transaction.category}
    >
      <option value="">-- Select --</option>
      {#each CATEGORIES as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </td>
  <td class="">
    <input
      class=""
      type="text"
      bind:value={props.transaction.item}
    />
  </td>
  <td class="">
    <input
      class="text-right"
      type="text"
      bind:value={amountText}
      onblur={commitAmount}
      onkeydown={onAmountKeydown}
    />
  </td>
</tr>
