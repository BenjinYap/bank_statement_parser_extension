<script lang="ts">
  import { shrinkPhoto, type VerticalCrop } from './shrinkPhoto';
  import Button from '../components/common/Button.svelte';
  import Section from '../components/common/Section.svelte';
  import ChoosePhotoButton from './ChoosePhotoButton.svelte';
  import PhotoCropper from './PhotoCropper.svelte';

  const STATUS_URL = '/receipt/status';
  const PHOTO_URL = '/receipt/photo';
  const STATUS_POLL_INTERVAL_MS = 1000;
  const FULL_PHOTO:VerticalCrop = { top: 0, bottom: 1 };

  // True while the receipt window in the extension polls the dev server for a photo.
  let windowReady:boolean = $state(false);
  // The status of the last upload. It is empty until the first upload in the current receipt window.
  let message:string = $state('');
  // The photo that the user crops. It is undefined before the user chooses a photo and after Send.
  let photoToCrop:File|undefined = $state(undefined);
  let crop:VerticalCrop = $state(FULL_PHOTO);

  async function upload(photo:File, photoCrop:VerticalCrop) {
    message = 'Uploading...';
    try {
      const response:Response = await fetch(PHOTO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: await shrinkPhoto(photo, photoCrop),
      });
      if (!response.ok) {
        message = `Upload failed: ${await response.text()}`;
        return;
      }

      message = 'Uploaded. Check the extension.';
    } catch (caught) {
      message = `Upload failed: ${(caught as Error).message}`;
    }
  }

  function startCrop(photo:File) {
    photoToCrop = photo;
    crop = FULL_PHOTO;
    message = '';
  }

  function send() {
    const photo:File|undefined = photoToCrop;
    if (photo === undefined) {
      return;
    }

    photoToCrop = undefined;
    // Not awaited. upload shows its own errors.
    upload(photo, crop);
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

      // The message and the photo belong to the receipt window that is now closed.
      if (!windowReady) {
        message = '';
        photoToCrop = undefined;
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
        Click "Scan Receipt" in the extension to activate the uploader.
      {/if}
      {#if windowReady}
        {#if photoToCrop}
          <PhotoCropper
            photo={photoToCrop}
            crop={crop}
            oncrop={(newCrop:VerticalCrop) => { crop = newCrop; }}
          />
        {/if}
        <div class="flex gap-2">
          <ChoosePhotoButton onchoose={startCrop} />
          {#if photoToCrop}
            <Button
              variant="primary"
              type="button"
              onclick={send}
            >
              Send
            </Button>
          {/if}
        </div>
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