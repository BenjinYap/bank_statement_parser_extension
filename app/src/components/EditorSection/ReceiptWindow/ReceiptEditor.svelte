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

  interface Props {
    // Maps a line item index to its item name. Line items without a name are not in the map.
    itemNames:Map<number, string>;
    // Receives an empty array when the photo goes away or Textract starts a new scan.
    onlineitemschange:(lineItems:LineItemResult[]) => void;
  }

  let props:Props = $props();

  type TextractResult = {
    // The line items that Textract found. It is undefined if the request failed.
    lineItems:LineItemResult[]|undefined;
    // The error message. It is undefined if the request succeeded.
    error:string|undefined;
  };

  // The Retry button sends this photo to Textract again.
  // It is not $state, because the template does not show it.
  let currentPhoto:Blob|undefined;
  let objectUrl:string|undefined;
  let photoUrl:string|undefined = $state();
  let pollTimeout:ReturnType<typeof setTimeout>|undefined;
  // Becomes true when the component is destroyed, so that a request that is still running does not start a new poll.
  let stopped:boolean = false;
  let pollResult:PollResult|undefined = $state();
  // It is undefined while Textract scans the photo.
  let textractResult:TextractResult|undefined = $state();
  // Counts the photos sent to Textract, so that a slow response for an older photo is ignored.
  // It is not $state, because the template does not show it.
  let analysisCount:number = 0;

  async function analyzePhoto(photo:Blob) {
    textractResult = undefined;
    props.onlineitemschange([]);
    analysisCount += 1;
    const analysisNumber:number = analysisCount;
    try {
      const lineItems:LineItemResult[] = await analyzeExpense(photo);
      if (analysisNumber !== analysisCount) {
        return;
      }

      textractResult = { lineItems, error: undefined };
      props.onlineitemschange(lineItems);
    } catch (caught) {
      console.error(caught);
      if (analysisNumber !== analysisCount) {
        return;
      }

      textractResult = { lineItems: undefined, error: `Textract failed: ${(caught as Error).message}` };
    }
  }

  function showPhoto(photo:Blob) {
    currentPhoto = photo;
    objectUrl = URL.createObjectURL(photo);
    photoUrl = objectUrl;
    // Not awaited. analyzePhoto shows its own errors.
    analyzePhoto(photo);
  }

  function retryAnalysis() {
    if (currentPhoto === undefined) {
      return;
    }

    analyzePhoto(currentPhoto);
  }

  async function poll() {
    // const result:PollResult = await pollPhoto(PHOTO_URL);
    const result:PollResult = await pollPhoto(mockReceiptUrl);
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

  function releasePhoto() {
    if (objectUrl === undefined) {
      return;
    }

    URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  }

  // Removes the current photo and asks the uploader for a new photo.
  function reupload() {
    releasePhoto();
    currentPhoto = undefined;
    photoUrl = undefined;
    textractResult = undefined;
    props.onlineitemschange([]);
    // Makes analyzePhoto ignore the response for the removed photo.
    analysisCount += 1;
    startPoll();
  }

  // Starts the poll when the window opens. Stops the poll and releases the photo when the window closes.
  $effect(() => {
    startPoll();

    return () => {
      stopped = true;
      clearTimeout(pollTimeout);
      releasePhoto();
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
    <Button
      variant="primary"
      onclick={reupload}
    >
      Reupload
    </Button>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <ReceiptPhoto
        {photoUrl}
        lineItems={textractResult?.lineItems ?? []}
        itemNames={props.itemNames}
      />
    </div>

    {#if textractResult === undefined}
      <Alert variant="info">Scanning...</Alert>
    {:else if textractResult.error}
      <Alert variant="error">{textractResult.error}</Alert>
      <Button
        variant="primary"
        onclick={retryAnalysis}
      >
        Retry
      </Button>
    {/if}
  {/if}
</div>