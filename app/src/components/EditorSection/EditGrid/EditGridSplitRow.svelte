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
  // it to the parent to perform the split. Guarded so the follow-up blur that
  // fires as this row unmounts does not also trigger a cancel.
  function commit(applyTax:boolean) {
    committed = true;
    props.oncommit(resolveAmount(amountText, applyTax));
  }

  function onAmountKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
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
  <td class="">
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
