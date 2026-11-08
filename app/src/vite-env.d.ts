/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // The ngrok static domain from NGROK_DOMAIN in app/.env.local. It is an empty string if the value is not set.
  readonly VITE_NGROK_DOMAIN:string;
}
