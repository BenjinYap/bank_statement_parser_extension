<script>
  let props = $props();
</script>

<section>
  <h1>{props.title}</h1>
  {#if props.children}
    {@render props.children()}
  {/if}
</section>

<style>
section {
  padding:10px;
  margin:var(--gutter) 0;
  background:white;
  border:1px solid #c3c3c3;
  border-radius:var(--border-radius);
  display:flex;
  flex-direction: column;
  gap: var(--gutter);
}

h1 {
  font-size: 1.2em;
  font-weight:600;
  margin:0;
  border-bottom:1px solid black;
}
</style>
