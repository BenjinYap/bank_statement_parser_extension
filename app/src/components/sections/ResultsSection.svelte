<script>
  import Section from "../Section.svelte";

  let props = $props();
  let csv = $derived.by(() => {
    let csv = '';
    props.rows?.forEach((r) => {
      csv += `${r.date},${r.category},${r.item},${r.amount}\n`;
    });
    return csv;
  });
</script>

<Section title="Parsed Rows">
  <button onclick={() => navigator.clipboard.writeText(csv)}>Copy CSV</button>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th>Item</th>
        <th class="amount">Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each props.rows as row}
        <tr>
          <td>{row.date}</td>
          <td>{row.category}</td>
          <td class="item {row.original_item ? 'replaced' : ''}">
            {row.item}
            {#if row.original_item}
              {@html `<span class="original">(${row.original_item})</span> <span title="Modified by parsing rules" class="material-symbols-outlined">more_horiz</span>`}
            {/if}
          </td>
          <td class="amount">{row.amount.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</Section>

<style>
  button {
    align-self: flex-start;
  }

  .item {
    display:flex;
    align-items: center;
    border:none;
    gap: calc(var(--gutter) / 2);
  }

  td :global(.original) {
    font-size: 0.8em;
  }

  td :global(.material-symbols-outlined) {
    font-size:1.2em;
    margin-left:auto;
  }

  .replaced {
    background: #d5edff;
  }

  .amount {
    text-align:right;
  }
</style>
