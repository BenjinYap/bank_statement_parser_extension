<script lang="ts">
  import { resolveAmount } from '../../../utils/amount';

  interface Props {
    oncommit: (amount:number) => void;
    oncancel: () => void;
  }

  let props:Props = $props();
  let amountText:string = $state('');
  let amountInput:HTMLInputElement|undefined = $state();

  $effect(() => {
    focus();
  });

  // Lets the parent focus the amount input again while this row is already showing.
  export function focus() {
    amountInput?.focus();
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      // Prevent the default action so it does not reach the category dropdown of
      // the row we are about to insert and focus, which would pop it open.
      event.preventDefault();
      // Resolves the typed amount the same way a normal amount input does and hands it to the parent
      // to perform the subtraction. Shift + Enter commits the raw amount without adding tax.
      props.oncommit(resolveAmount(amountText, !event.shiftKey));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      props.oncancel();
    }
  }
</script>

<tr>
  <td class=""></td>
  <td class=""></td>
  <td class="relative">
    <span class="absolute text-xs bottom-1/1 bg-primary-600 font-medium px-1">Subtract</span>
    <input
      class="text-right"
      type="text"
      bind:this={amountInput}
      bind:value={amountText}
      onkeydown={onAmountKeydown}
    />
  </td>
</tr>
