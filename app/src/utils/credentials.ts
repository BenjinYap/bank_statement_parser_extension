import type { Credentials } from '../models/Credentials';

const STORAGE_KEY = 'credentials';

// A page on localhost has no chrome.storage, so it uses window.localStorage in its place.
function hasExtensionStorage():boolean {
  return typeof chrome !== 'undefined' && chrome.storage?.local !== undefined;
}

export async function loadCredentials():Promise<Credentials|undefined> {
  if (!hasExtensionStorage()) {
    const raw:string|null = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return undefined;
    }

    try {
      return JSON.parse(raw) as Credentials;
    } catch {
      // If the saved value is not valid JSON, the window starts with empty fields.
      return undefined;
    }
  }

  const result:Record<string, unknown> = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] as Credentials|undefined;
}

export async function saveCredentials(credentials:Credentials) {
  if (!hasExtensionStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return;
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: credentials });
}
