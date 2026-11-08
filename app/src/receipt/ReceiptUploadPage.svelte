<script lang="ts">
  import { shrinkPhoto } from './shrinkPhoto';
  import Section from '../components/common/Section.svelte';

  const STATUS_URL = '/receipt/status';
  const PHOTO_URL = '/receipt/photo';
  const STATUS_POLL_INTERVAL_MS = 1000;

  // True while the receipt window in the extension polls the dev server for a photo.
  let windowReady:boolean = $state(false);
  let uploading:boolean = $state(false);
  let message:string = $state('');

  async function upload(photo:File) {
    uploading = true;
    message = '';
    try {
      const response:Response = await fetch(PHOTO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: await shrinkPhoto(photo),
      });
      if (!response.ok) {
        message = `Upload failed: ${await response.text()}`;
        return;
      }

      message = 'Uploaded. Check the extension.';
    } catch (caught) {
      message = `Upload failed: ${(caught as Error).message}`;
    } finally {
      uploading = false;
    }
  }

  function handlePhotoChange(event:Event & { currentTarget:HTMLInputElement }) {
    const input:HTMLInputElement = event.currentTarget;
    const photo:File|undefined = input.files?.[0];
    // Clear the input, so that the next photo causes a change event too.
    input.value = '';
    if (photo === undefined) {
      return;
    }

    // Not awaited. upload shows its own errors.
    upload(photo);
  }

  // Asks the dev server each second whether the receipt window is open.
  $effect(() => {
    let stopped:boolean = false;
    let timeoutId:ReturnType<typeof setTimeout>|undefined;

    async function pollStatus() {
      try {
        const response:Response = await fetch(STATUS_URL, { cache: 'no-store' });
        const body:{ ready:boolean } = await response.json();
        if (stopped) {
          return;
        }

        windowReady = body.ready;
      } catch {
        if (stopped) {
          return;
        }

        windowReady = false;
      }

      timeoutId = setTimeout(pollStatus, STATUS_POLL_INTERVAL_MS);
    }

    pollStatus();

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  });
</script>

<div class="max-w-xs mx-auto w-full py-4 flex flex-col gap-2">
  <Section>
    <div class="flex flex-col gap-2 items-center text-center">
      {#if !windowReady}
        Click "Scan Receipt" in the extension to activate this page.
      {/if}
      {#if windowReady && !message}
        <label
          class="cursor-pointer bg-primary-600 text-white rounded px-3 py-1.5 hover:bg-primary-500 active:bg-primary-700"
        >
          Upload Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden"
            onchange={handlePhotoChange}
          />
        </label>
      {/if}
      {#if message}
        {message}
      {/if}
    </div>
  </Section>
</div>

<!--suppress CssUnusedSymbol -->
<style>
  :global(.banker) {
    display: none!important;
  }
</style>