<script lang="ts">
  import Section from '../common/Section.svelte';
  import Heading from '../common/Heading.svelte';
  import Button from '../common/Button.svelte';

</script>

<Section
  title="Credentials"
  expanded={true}
  className="fixed left-4 top-4 w-[300px]"
>
  <div class="grid grid-rows-[auto] grid-cols-[100px_1fr] gap-2 items-center">
    <div class="col-span-2">
      <Heading level={2}>AWS</Heading>
    </div>

    <label>Access Key</label>
    <input type="text"/>
    <label>Secret Key</label>
    <input type="text"/>

    <div class="col-span-2">
      <Button
        className="w-full"
        variant="primary"
      >
        Save
      </Button>
    </div>
  </div>
</Section>