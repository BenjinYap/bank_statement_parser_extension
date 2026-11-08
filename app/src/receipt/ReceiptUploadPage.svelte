<script lang="ts">
  import PhotoButton from './PhotoButton.svelte';
  import { shrinkPhoto } from './shrinkPhoto';
  import Section from '../components/common/Section.svelte';

  const STATUS_URL = '/receipt/status';
  const PHOTO_URL = '/receipt/photo';
  const STATUS_POLL_INTERVAL_MS = 1000;

  // True while the receipt window in the extension polls the dev server for a photo.
  let windowReady:boolean = $state(false);
  let uploading:boolean = $state(false);
  let message:string = $state('');

  let buttonText:string = $derived.by(() => {
    if (uploading) {
      return 'Uploading...';
    }

    if (windowReady) {
      return 'Take receipt photo';
    }

    return 'Open Scan Receipt in the extension';
  });

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

<div class="max-w-6xl mx-auto w-full py-4 flex flex-col gap-2">
  <Section
    title="Receipt Scanner"

  >
    <div class="flex flex-col gap-2 items-center">
      {#if !windowReady}
        Click "Scan Receipt" in the extension to activate this page.
      {/if}
      <PhotoButton
        text={buttonText}
        disabled={!windowReady || uploading}
        onphoto={upload}
      />
      <p class="min-h-6 text-xl text-center">{message}</p>
    </div>
  </Section>
</div>

<style>
  :global(.banker) {
    display: none!important;
  }
</style>