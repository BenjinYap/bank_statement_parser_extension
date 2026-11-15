<script lang="ts">
  import ReceiptQrCode from './ReceiptQrCode.svelte';
  import ReceiptPhoto from './ReceiptPhoto.svelte';
  import { analyzeExpense, type LineItemResult } from '../../../utils/textract';
  import { pollPhoto, type PollResult } from './pollPhoto';
  import Heading from '../../common/Heading.svelte';
  import Alert from '../../common/Alert.svelte';
  import mockReceiptUrl from './mock-receipt.jpg';
  import Button from '../../common/Button.svelte';

  // The receipt server plugin in app/vite/receiptServer.ts serves this endpoint during `npm run dev`.
  // 5173 is the default Vite port.
  const PHOTO_URL = 'http://localhost:5173/receipt/photo';
  const POLL_INTERVAL_MS = 1000;

  let objectUrl:string|undefined;
  let photoUrl:string|undefined = $state();
  let pollTimeout:ReturnType<typeof setTimeout>|undefined;
  // Becomes true when the component is destroyed, so that a request that is still running does not start a new poll.
  let stopped:boolean = false;
  let pollResult:PollResult|undefined = $state();
  let lineItems:LineItemResult[] = $state([]);
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

  function showPhoto(photo:Blob) {
    objectUrl = URL.createObjectURL(photo);
    photoUrl = objectUrl;
    // A new photo removes all work on the previous photo.
    lineItems = [];
    analysisError = undefined;
    // Not awaited. analyzePhoto shows its own errors.
    analyzePhoto(photo);
  }

  async function poll() {
    const result:PollResult = await pollPhoto(PHOTO_URL);
    // const result:PollResult = await pollPhoto(mockReceiptUrl);
    if (stopped) {
      return;
    }

    pollResult = result;
    if (result.error) {
      return;
    }

    if (result.photo) {
      showPhoto(result.photo);
      return;
    }

    pollTimeout = setTimeout(poll, POLL_INTERVAL_MS);
  }

  function startPoll() {
    pollResult = undefined;
    poll();
  }

  // Starts the poll when the window opens. Stops the poll and releases the photo when the window closes.
  $effect(() => {
    startPoll();

    return () => {
      stopped = true;
      clearTimeout(pollTimeout);
      if (objectUrl !== undefined) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  });
</script>

<div class="flex flex-col gap-2 w-xs min-h-0">
  <Heading
    level={2}
  >
    Editor
  </Heading>

  {#if photoUrl === undefined}
    <ReceiptQrCode />

    {#if !pollResult?.photo && !pollResult?.error}
      <Alert variant="info">Waiting for the uploader...</Alert>
    {:else if pollResult?.error}
      <Alert variant="error">{pollResult.error}</Alert>
      <Button
        variant="primary"
        onclick={startPoll}
      >
        Retry
      </Button>
    {/if}
  {:else}
    <div class="flex-1 min-h-0 overflow-y-auto">
      <ReceiptPhoto
        {photoUrl}
        {lineItems}
      />
    </div>

    {#if lineItems.length === 0}
      <Alert variant="info">Scanning...</Alert>
    {/if}

    {#if analysisError !== undefined}
      <p class="text-red-400">{analysisError}</p>
    {/if}
  {/if}
</div>