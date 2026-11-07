<script lang="ts">
  import Section from '../common/Section.svelte';
  import Heading from '../common/Heading.svelte';
  import Button from '../common/Button.svelte';
  import type { Credentials } from '../../models/Credentials';
  import { saveCredentials } from '../../utils/credentials';

  function createEmptyCredentials():Credentials {
    return { aws: { accessKey: '', secretKey: '' } };
  }

  // The window is write only. It never shows the saved credentials.
  let credentials:Credentials = $state(createEmptyCredentials());
  let expanded:boolean = $state(true);

  async function handleSave() {
    // chrome.storage cannot clone a $state proxy, so save a plain copy.
    await saveCredentials($state.snapshot(credentials));

    credentials = createEmptyCredentials();
    expanded = false;
  }
</script>

<Section
  title="Credentials"
  bind:expanded
  className="fixed left-4 top-4 w-[300px]"
>
  <div class="grid grid-rows-[auto] grid-cols-[100px_1fr] gap-2 items-center">
    <div class="col-span-2">
      <Heading level={2}>AWS</Heading>
    </div>

    <label for="aws-access-key">Access Key</label>
    <input
      id="aws-access-key"
      type="text"
      bind:value={credentials.aws.accessKey}
    />
    <label for="aws-secret-key">Secret Key</label>
    <input
      id="aws-secret-key"
      type="password"
      bind:value={credentials.aws.secretKey}
    />

    <div class="col-span-2">
      <Button
        className="w-full"
        variant="primary"
        onclick={handleSave}
      >
        Save
      </Button>
    </div>
  </div>
</Section>
