import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGridSplitRow from '../../../../src/components/EditorSection/EditGrid/EditGridSplitRow.svelte';

describe('EditGridSplitRow', () => {
  it('renders only an amount input (no category or item cell inputs)', () => {
    const { getAllByRole } = render(EditGridSplitRow, {
      props: { oncommit: vi.fn(), oncancel: vi.fn() },
    });
    expect(getAllByRole('textbox')).toHaveLength(1);
  });

  it('commits the resolved amount with tax on Enter', async () => {
    const oncommit = vi.fn();
    const { container } = render(EditGridSplitRow, {
      props: { oncommit, oncancel: vi.fn() },
    });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '10' } });
    await fireEvent.keyDown(amountInput, { key: 'Enter' });

    expect(oncommit).toHaveBeenCalledWith(11.3);
  });

  it('prevents the default action of the committing Enter (so the next row\'s dropdown stays closed)', async () => {
    const { container } = render(EditGridSplitRow, {
      props: { oncommit: vi.fn(), oncancel: vi.fn() },
    });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '10' } });
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    amountInput.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('commits the raw amount without tax on Shift + Enter', async () => {
    const oncommit = vi.fn();
    const { container } = render(EditGridSplitRow, {
      props: { oncommit, oncancel: vi.fn() },
    });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '10' } });
    await fireEvent.keyDown(amountInput, { key: 'Enter', shiftKey: true });

    expect(oncommit).toHaveBeenCalledWith(10);
  });

  it('cancels on Escape without committing', async () => {
    const oncommit = vi.fn();
    const oncancel = vi.fn();
    const { container } = render(EditGridSplitRow, {
      props: { oncommit, oncancel },
    });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '10' } });
    await fireEvent.keyDown(amountInput, { key: 'Escape' });

    expect(oncancel).toHaveBeenCalled();
    expect(oncommit).not.toHaveBeenCalled();
  });

  it('cancels on blur without committing', async () => {
    const oncommit = vi.fn();
    const oncancel = vi.fn();
    const { container } = render(EditGridSplitRow, {
      props: { oncommit, oncancel },
    });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '10' } });
    await fireEvent.blur(amountInput);

    expect(oncancel).toHaveBeenCalled();
    expect(oncommit).not.toHaveBeenCalled();
  });
});
