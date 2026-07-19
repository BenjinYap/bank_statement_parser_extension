import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGridTransaction from '../../../../src/components/EditorSection/EditGrid/EditGridTransaction.svelte';
import type { EditTransaction } from '../../../../src/models/EditTransaction';

describe('EditGridTransaction', () => {
  it('renders the initial amount as text', () => {
    const transaction:EditTransaction = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridTransaction, { props: { transaction } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;
    expect(amountInput.value).toBe('42.5');
  });

  it('does not overwrite a partially-typed amount before blur', async () => {
    const transaction:EditTransaction = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridTransaction, { props: { transaction } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '42.' } });

    expect(amountInput.value).toBe('42.');
    expect(transaction.amount).toBe(42.5);
  });

  it('parses the typed amount into a number on blur', async () => {
    const transaction:EditTransaction = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridTransaction, { props: { transaction } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '99.75' } });
    await fireEvent.blur(amountInput);

    expect(transaction.amount).toBe(99.75);
    expect(amountInput.value).toBe('99.75');
  });

  it('parses the typed amount into a number when Enter is pressed', async () => {
    const transaction:EditTransaction = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridTransaction, { props: { transaction } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '99.75' } });
    await fireEvent.keyDown(amountInput, { key: 'Enter' });

    expect(transaction.amount).toBe(99.75);
    expect(amountInput.value).toBe('99.75');
  });

  it('evaluates a formula when the amount starts with an equal sign', async () => {
    const transaction:EditTransaction = { category: 'Food', item: 'Groceries', amount: 42.5 };
    const { container } = render(EditGridTransaction, { props: { transaction } });
    const amountInput = container.querySelector('input.text-right') as HTMLInputElement;

    await fireEvent.input(amountInput, { target: { value: '=12.5 + 3 * 2' } });
    await fireEvent.blur(amountInput);

    expect(transaction.amount).toBe(18.5);
    expect(amountInput.value).toBe('18.5');
  });

});
