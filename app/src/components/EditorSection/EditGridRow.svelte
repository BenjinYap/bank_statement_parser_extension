<script lang="ts">
  import type { EditRow } from '../../models/EditRow';
  import { CATEGORIES } from '../../utils/categories';

  interface Props {
    row: EditRow;
  }

  let props:Props = $props();
  let amountText:string = $state(props.row.amount.toString());

  $effect(() => {
    amountText = props.row.amount.toString();
  });

  function commitAmount() {
    props.row.amount = parseFloat(amountText) || 0;
    amountText = props.row.amount.toString();
  }
</script>

<tr>
  <td class="">
    <select
      class=""
      bind:value={props.row.category}
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
      bind:value={props.row.item}
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
