<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import { CATEGORIES } from '../../../utils/categories';
  import { resolveAmount } from '../../../utils/amount';

  interface Props {
    transaction: EditTransaction;
    autofocus?: boolean;
  }

  let props:Props = $props();
  let amountText:string = $state(props.transaction.amount.toString());
  let categorySelect:HTMLSelectElement|undefined = $state();
  let amountInput:HTMLInputElement|undefined = $state();

  $effect(() => {
    amountText = props.transaction.amount.toString();
  });

  $effect(() => {
    if (props.autofocus && categorySelect) {
      categorySelect.focus();
    }
  });

  // Resolves the typed amount (evaluating any formula first) and, unless tax is
  // skipped, multiplies it by the tax rate and rounds to the nearest cent.
  function commitAmount(applyTax:boolean = true) {
    props.transaction.amount = resolveAmount(amountText, applyTax);
    amountText = props.transaction.amount.toString();
  }

  // Discards the typed amount and restores the last committed value.
  function revertAmount() {
    amountText = props.transaction.amount.toString();
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      // Shift + Enter commits the raw amount without adding tax.
      commitAmount(!event.shiftKey);
    } else if (event.key === 'Escape') {
      // Escape reverts to the original value but keeps the input focused.
      event.preventDefault();
      revertAmount();
      amountInput?.focus();
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
      bind:this={amountInput}
      bind:value={amountText}
      onblur={revertAmount}
      onkeydown={onAmountKeydown}
    />
  </td>
</tr>
