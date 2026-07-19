<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import { CATEGORIES } from '../../../utils/categories';
  import { calculate } from '../../../utils/calculator';

  interface Props {
    transaction: EditTransaction;
    autofocus?: boolean;
  }

  // Sales tax percentage applied to the resolved amount (13% => 1.13x).
  const TAX_PERCENT:number = 13;

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

  // Resolves the typed amount (evaluating any formula first) and, unless tax is
  // skipped, multiplies it by the tax rate and rounds to the nearest cent.
  function commitAmount(applyTax:boolean = true) {
    let amount:number = calculate(amountText);
    if (applyTax) {
      // Apply tax in integer-cent arithmetic. Multiplying by 1.13 directly is
      // inexact (1.13 has no exact float), which rounds exact half-cents like
      // 42.5 -> 48.03 down a penny; using (100 + TAX_PERCENT) keeps it exact.
      const cents:number = Math.round(amount * 100);
      const taxedCents:number = Math.round((cents * (100 + TAX_PERCENT)) / 100);
      amount = taxedCents / 100;
    }
    props.transaction.amount = amount;
    amountText = props.transaction.amount.toString();
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      // Shift + Enter commits the raw amount without adding tax.
      commitAmount(!event.shiftKey);
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
      onblur={() => commitAmount()}
      onkeydown={onAmountKeydown}
    />
  </td>
</tr>
