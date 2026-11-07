<script lang="ts">
  import Section from '../../common/Section.svelte';
  import Button from '../../common/Button.svelte';
  import { analyzeExpense } from '../../../utils/textract';

  interface Props {
    onclose: () => void;
  }

  let props:Props = $props();

  // The receipt server plugin in app/vite/receiptServer.ts serves this endpoint during `npm run dev`.
  // 5173 is the default Vite port.
  const PHOTO_URL = 'http://localhost:5173/receipt/photo';
  const POLL_INTERVAL_MS = 1000;

  let photoUrl:string|undefined = $state();
  let error:string|undefined = $state();

  async function analyzePhoto(photo:Blob) {
    try {
      // TODO: Replace this log with the box overlay when the box mapping step exists.
      console.log('Textract AnalyzeExpense response', await analyzeExpense(photo));
    } catch (caught) {
      console.error(caught);
      error = `Textract failed: ${(caught as Error).message}`;
    }
  }

  // Asks the dev server for a photo each second until a photo arrives or the window closes.
  $effect(() => {
    let stopped:boolean = false;
    let timeoutId:ReturnType<typeof setTimeout>|undefined;
    let objectUrl:string|undefined;

    async function poll() {
      try {
        const response:Response = await fetch(PHOTO_URL, { cache: 'no-store' });
        if (stopped) {
          return;
        }

        if (response.status === 200) {
          const blob:Blob = await response.blob();
          if (stopped) {
            return;
          }

          objectUrl = URL.createObjectURL(blob);
          photoUrl = objectUrl;
          // Not awaited. analyzePhoto shows its own errors.
          analyzePhoto(blob);
          return;
        }

        // A 204 status means that no photo is waiting yet.
        if (response.status === 204) {
          error = undefined;
        } else {
          error = `The dev server returned status ${response.status}.`;
        }
      } catch {
        if (stopped) {
          return;
        }

        error = 'The dev server is not reachable. Run `npm run dev` in app/.';
      }

      // Retry after a 204 status, an error status, or an unreachable server.
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

<div class="fixed inset-0 z-10 flex items-center justify-center p-2 bg-black/70">
  <Section
    title="Scan Receipt"
    className="flex flex-col max-h-full max-w-full bg-surface-950"
  >
    <div class="flex flex-col gap-2 items-center">
      {#if photoUrl === undefined}
        <p>Waiting for a photo from the phone...</p>
      {:else}
        <img
          src={photoUrl}
          alt="Receipt"
          class="max-h-[80vh] max-w-full object-contain"
        />
      {/if}

      {#if error !== undefined}
        <p class="text-red-400">{error}</p>
      {/if}

      <Button
        variant="unfilled"
        onclick={props.onclose}
      >
        {photoUrl === undefined ? 'Cancel' : 'Close'}
      </Button>
    </div>
  </Section>
</div>
