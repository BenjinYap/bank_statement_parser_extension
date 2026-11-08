<script lang="ts">
  import ReceiptQrCode from './ReceiptQrCode.svelte';
  import ReceiptPhoto from './ReceiptPhoto.svelte';
  import { analyzeExpense, type LineItemResult } from '../../../utils/textract';
  import Section from '../../common/Section.svelte';
  import Heading from '../../common/Heading.svelte';
  import Alert from '../../common/Alert.svelte';
  import mockReceiptUrl from './mock-receipt.jpg';

  // The receipt server plugin in app/vite/receiptServer.ts serves this endpoint during `npm run dev`.
  // 5173 is the default Vite port.
  const PHOTO_URL = 'http://localhost:5173/receipt/photo';
  const POLL_INTERVAL_MS = 1000;

  let photoUrl:string|undefined = $state();
  let lineItems:LineItemResult[] = $state([]);
  let pollError:string|undefined = $state();
  let analysisError:string|undefined = $state();
  // Counts the photos sent to Textract, so that a slow response for an older photo is ignored.
  // It is not $state, because the template does not show it.
  let analysisCount:number = 0;

  async function analyzePhoto(photo:Blob) {
    analysisCount += 1;
    const analysisNumber:number = analysisCount;
    try {
      const result:LineItemResult[] = await analyzeExpense(photo);
      if (analysisNumber !== analysisCount) {
        return;
      }

      lineItems = result;
    } catch (caught) {
      console.error(caught);
      if (analysisNumber !== analysisCount) {
        return;
      }

      analysisError = `Textract failed: ${(caught as Error).message}`;
    }
  }

  // Asks the dev server for a new photo each second until the window closes.
  // Each new photo from the phone replaces the current photo.
  $effect(() => {
    let stopped:boolean = false;
    let timeoutId:ReturnType<typeof setTimeout>|undefined;
    let objectUrl:string|undefined;

    function showPhoto(photo:Blob) {
      if (objectUrl !== undefined) {
        URL.revokeObjectURL(objectUrl);
      }

      objectUrl = URL.createObjectURL(photo);
      photoUrl = objectUrl;
      // A new photo removes all work on the previous photo.
      lineItems = [];
      analysisError = undefined;
      // Not awaited. analyzePhoto shows its own errors.
      analyzePhoto(photo);
    }

    async function poll() {
      try {
        // const response:Response = await fetch(PHOTO_URL, { cache: 'no-store' });
        const response:Response = await fetch(mockReceiptUrl, { cache: 'no-store' });
        if (stopped) {
          return;
        }

        if (response.status === 200) {
          const blob:Blob = await response.blob();
          if (stopped) {
            return;
          }

          pollError = undefined;
          showPhoto(blob);
          return;
        } else if (response.status === 204) {
          // A 204 status means that no new photo is waiting.
          pollError = undefined;
        } else {
          pollError = `The uploder returned an unexpected ${response.status}.`;
        }
      } catch {
        if (stopped) {
          return;
        }

        pollError = 'The uploader is not running.';
      }

      timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
      if (objectUrl !== undefined) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  });
</script>

<div class="flex flex-col gap-2 w-xs">
  <Heading
    level={2}
  >
    Editor
  </Heading>

  {#if photoUrl === undefined}
    <ReceiptQrCode />
    <Alert variant="info">Waiting for the uploader...</Alert>
  {:else}
    <ReceiptPhoto
      {photoUrl}
      {lineItems}
    />
  {/if}

  <h1>hello</h1>

  {#if pollError !== undefined}
    <Alert variant="error">{pollError}</Alert>
  {/if}

  {#if analysisError !== undefined}
    <p class="text-red-400">{analysisError}</p>
  {/if}
</div>