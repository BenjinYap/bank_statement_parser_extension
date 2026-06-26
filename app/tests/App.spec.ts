import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/svelte'
import App from '../src/App.svelte'

describe('App', () => {
  it('renders parsed rows from the mock bank page in dev mode', async () => {
    // jsdom has no `chrome` global; empty object → dev_mode path
    vi.stubGlobal('chrome', {})

    render(App)

    await waitFor(() => {
      if (!document.body.textContent?.match(/\d{4}-\d{2}-\d{2}/)) {
        throw new Error('rows not rendered yet')
      }
    }, { timeout: 5000 })

    expect(document.body.textContent).toMatch(/\$\d+\.\d{2}/)
  })
})
