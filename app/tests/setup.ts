import '@testing-library/jest-dom/vitest'

// jsdom does not implement ResizeObserver, which EditorSection relies on.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub;
