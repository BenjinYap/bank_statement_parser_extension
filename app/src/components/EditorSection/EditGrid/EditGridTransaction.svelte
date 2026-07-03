<script lang="ts">
  import type { EditTransaction } from '../../../models/EditTransaction';
  import { CATEGORIES } from '../../../utils/categories';

  interface Props {
    transaction: EditTransaction;
  }

  let props:Props = $props();
  let amountText:string = $state(props.transaction.amount.toString());

  $effect(() => {
    amountText = props.transaction.amount.toString();
  });

  function commitAmount() {
    props.transaction.amount = parseFloat(amountText) || 0;
    amountText = props.transaction.amount.toString();
  }
</script>

<tr>
  <td class="">
    <select
      class=""
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
    />
  </td>
</tr>
