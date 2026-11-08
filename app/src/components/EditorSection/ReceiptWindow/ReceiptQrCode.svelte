<script lang="ts">
  import QRCode from 'qrcode';

  // vite.config.ts copies NGROK_DOMAIN from app/.env.local into the build.
  const NGROK_DOMAIN:string = import.meta.env.VITE_NGROK_DOMAIN;
  const PAGE_URL:string = `https://${NGROK_DOMAIN}/receipt`;

  let qrCodeUrl:string|undefined = $state();

  // The script runs one time when the component is made, so this makes the QR code one time.
  if (NGROK_DOMAIN !== '') {
    QRCode.toDataURL(PAGE_URL, { margin: 2, width: 256 })
      .then((dataUrl:string) => {
        qrCodeUrl = dataUrl;
      });
  }
</script>

{#if NGROK_DOMAIN === ''}
  <p class="text-red-400">Set NGROK_DOMAIN in app/.env.local, then run `npm run build` to show the QR code.</p>
{:else}
  {#if qrCodeUrl !== undefined}
    <img
      src={qrCodeUrl}
      alt="QR code for the phone upload page"
      class="w-64 h-64"
    />
  {/if}
{/if}
