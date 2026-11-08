<script lang="ts">
  import QRCode from 'qrcode';
  import Alert from '../../common/Alert.svelte';

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
  <Alert variant="error"><code>NGROK_DOMAIN</code> must be set in <code>app/.env.local</code>.</Alert>
{:else}
  {#if qrCodeUrl !== undefined}
    <img
      src={qrCodeUrl}
      alt="QR code for the phone upload page"
      class="w-full"
    />
  {/if}
{/if}
