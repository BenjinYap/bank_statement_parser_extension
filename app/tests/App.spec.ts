import { describe, expect, it, vi } from 'vitest'
import { render, waitFor, fireEvent } from '@testing-library/svelte'
import App from '../src/App.svelte'

describe('App', () => {
  async function waitForRows() {
    await waitFor(() => {
      if (!document.body.textContent?.match(/\d{4}-\d{2}-\d{2}/)) {
        throw new Error('rows not rendered yet');
      }
    }, { timeout: 5000 });
  }

  it('renders parsed rows from the mock bank page in dev mode', async () => {
    // jsdom has no `chrome` global; empty object → dev_mode path
    vi.stubGlobal('chrome', {})
    render(App)
    await waitForRows()
    expect(document.body.textContent).toMatch(/\$\d+\.\d{2}/)
  })

  it('closes the edit panel after saving', async () => {
    vi.stubGlobal('chrome', {})
    const { getAllByText, getByText, queryByText } = render(App)
    await waitForRows()

    await fireEvent.click(getAllByText(/\d{4}-\d{2}-\d{2}/)[0])
    await waitFor(() => expect(getByText('Original Transaction')).toBeInTheDocument())

    await fireEvent.click(getByText('Save'))

    expect(queryByText('Original Transaction')).not.toBeInTheDocument()
    expect(getByText('Select a transaction to edit.')).toBeInTheDocument()
  })
})
