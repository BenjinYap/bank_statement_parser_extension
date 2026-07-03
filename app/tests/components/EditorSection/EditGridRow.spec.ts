import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGridRow from '../../../src/components/EditorSection/EditGridRow.svelte';
import type { EditRow } from '../../../src/models/EditRow';

describe('EditGridRow', () => {
  it('renders the initial amount as text', () => {
    const row:EditRow = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridRow, { props: { row } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;
    expect(amountInput.value).toBe('42.5');
  });

  it('does not overwrite a partially-typed amount before blur', async () => {
    const row:EditRow = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridRow, { props: { row } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '42.' } });

    expect(amountInput.value).toBe('42.');
    expect(row.amount).toBe(42.5);
  });

  it('parses the typed amount into a number on blur', async () => {
    const row:EditRow = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridRow, { props: { row } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '99.75' } });
    await fireEvent.blur(amountInput);

    expect(row.amount).toBe(99.75);
    expect(amountInput.value).toBe('99.75');
  });

  it('falls back to 0 when the typed amount is not a valid number', async () => {
    const row:EditRow = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridRow, { props: { row } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: 'abc' } });
    await fireEvent.blur(amountInput);

    expect(row.amount).toBe(0);
    expect(amountInput.value).toBe('0');
  });
});
