<script lang="ts">
  import { resolveAmount } from '../../../utils/amount';

  interface Props {
    oncommit: (amount:number) => void;
    oncancel: () => void;
  }

  let props:Props = $props();
  let amountText:string = $state('');
  let amountInput:HTMLInputElement|undefined = $state();
  let committed:boolean = $state(false);

  $effect(() => {
    amountInput?.focus();
  });

  // Resolves the typed amount the same way a normal amount input does and hands
  // it to the parent to perform the subtraction. Guarded so the follow-up blur
  // that fires as this row unmounts does not also trigger a cancel.
  function commit(applyTax:boolean) {
    committed = true;
    props.oncommit(resolveAmount(amountText, applyTax));
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      // Prevent the default action so it does not reach the category dropdown of
      // the row we are about to insert and focus, which would pop it open.
      event.preventDefault();
      // Shift + Enter commits the raw amount without adding tax.
      commit(!event.shiftKey);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      props.oncancel();
    }
  }

  function onAmountBlur() {
    if (!committed) {
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
      onblur={onAmountBlur}
      onkeydown={onAmountKeydown}
    />
  </td>
</tr>
