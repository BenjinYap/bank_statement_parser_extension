import { mount } from 'svelte';
import '../app.css';
import ReceiptUploadPage from './ReceiptUploadPage.svelte';

// The phone opens this page through the receipt server plugin in app/vite/receiptServer.ts.
const target:HTMLElement|null = document.getElementById('app');
if (target === null) {
  throw new Error('The page has no #app element.');
}

mount(ReceiptUploadPage, { target });
