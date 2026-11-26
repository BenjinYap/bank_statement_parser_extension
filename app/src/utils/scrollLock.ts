// Counts the open overlays, so that the page scrolls again only after the last overlay closes.
let lockCount:number = 0;

// Stops the scroll of the page behind an overlay and returns the function that starts it again.
// Call it in an $effect, so that the lock is removed when the component is destroyed.
export function lockPageScroll():() => void {
  lockCount += 1;
  document.documentElement.style.overflow = 'hidden';

  return () => {
    lockCount -= 1;
    if (lockCount > 0) {
      return;
    }

    document.documentElement.style.overflow = '';
  };
}
