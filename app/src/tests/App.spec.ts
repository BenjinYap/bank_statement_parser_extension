import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/svelte'
import App from '../App.svelte'

describe('App', () => {
  it('loads the mock bank page HTML into the textarea in dev mode', async () => {
    // jsdom has no `chrome` global at all (unlike a real Chrome tab, where
    // `chrome` exists but `chrome.runtime` is undefined outside an extension page).
    vi.stubGlobal('chrome', {})

    render(App)

    const textarea = await waitFor(() => {
      const el = screen.getByRole('textbox') as HTMLTextAreaElement
      if (!el.value) throw new Error('textarea not populated yet')
      return el
    })

    expect(textarea.value).toContain('_ngcontent-uyt-c435')
  })
})
