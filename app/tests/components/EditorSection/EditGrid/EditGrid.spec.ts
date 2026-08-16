import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditGrid from '../../../../src/components/EditorSection/EditGrid/EditGrid.svelte';
import type { EditTransaction } from '../../../../src/models/EditTransaction';
import { reactiveArray } from '../../../helpers/reactive.svelte';

const mockTransactions:EditTransaction[] = [
  { category: 'Food', item: 'Groceries', amount: 42.5 },
  { category: 'Transportation', item: 'Bus', amount: 3.2 },
];

describe('EditGrid', () => {
  it('renders item and amount inputs for all transactions', () => {
    const { getAllByRole } = render(EditGrid, {
      props: { editTransactions: mockTransactions },
    });
    // 2 transactions × 2 text inputs (item + amount); category is a <select>
    expect(getAllByRole('textbox')).toHaveLength(4);
  });

  it('renders category as a select with the correct initial value', () => {
    const { container } = render(EditGrid, {
      props: { editTransactions: mockTransactions },
    });
    const selects = container.querySelectorAll('select') as NodeListOf<HTMLSelectElement>;
    expect(selects).toHaveLength(2);
    expect(selects[0].value).toBe('Food');
    expect(selects[1].value).toBe('Transportation');
  });

  it('pushes a new transaction onto editTransactions when Add transaction is clicked', async () => {
    const editTransactions:EditTransaction[] = [
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ];
    const { getByText } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.click(getByText('Add transaction'));
    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
      { category: 'Food', item: '', amount: 0 },
    ]);
  });

  it('renders a bottom row with a sum of all the amounts', async () => {
    const { getByText } = render(EditGrid, {
      props: { editTransactions: mockTransactions },
    });
    expect(getByText('$45.70')).toBeInTheDocument();
  });

  it('focuses the category dropdown of a newly added transaction', async () => {
    // editTransactions must be reactive (like the real $state array in
    // TransactionEditPanel) for the grid to notice the push and re-render.
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { getByText, getAllByRole } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.click(getByText('Add transaction'));
    expect(getAllByRole('combobox')[1]).toHaveFocus();
  });

  it('defaults the new dropdown to the category of the row above it', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { getByText, getAllByRole } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.click(getByText('Add transaction'));
    const selects = getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[1].value).toBe('Food');
  });

  it('pressing Ctrl+Plus adds a new blank row to the grid', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { getAllByRole } = render(EditGrid, {
      props: { editTransactions },
    });
    expect(getAllByRole('combobox')).toHaveLength(1);
    await fireEvent.keyDown(window, { key: '+', ctrlKey: true });
    expect(getAllByRole('combobox')).toHaveLength(2);
  });

  it('pressing Ctrl+Minus shows an amount-only interim row without a new dropdown', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { getAllByRole, container } = render(EditGrid, {
      props: { editTransactions },
    });
    expect(container.querySelectorAll('input.text-right')).toHaveLength(1);

    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });

    // A second amount input appears, but no extra category dropdown or item input.
    expect(container.querySelectorAll('input.text-right')).toHaveLength(2);
    expect(getAllByRole('combobox')).toHaveLength(1);
  });

  it('does not open the interim row when there are no transactions', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    expect(container.querySelectorAll('input.text-right')).toHaveLength(0);
  });

  it('leaves the first transaction unchanged when the interim row is cancelled with Escape', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: '10' } });
    await fireEvent.keyDown(interimInput, { key: 'Escape' });

    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    expect(container.querySelectorAll('input.text-right')).toHaveLength(1);
  });

  it('leaves the first transaction unchanged when the interim row is cancelled with blur', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: '10' } });
    await fireEvent.blur(interimInput);

    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    expect(container.querySelectorAll('input.text-right')).toHaveLength(1);
  });

  it('subtracts the committed amount from the first row and inserts it underneath (Shift+Enter, no tax)', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: '10' } });
    await fireEvent.keyDown(interimInput, { key: 'Enter', shiftKey: true });

    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 32.5 },
      { category: 'Food', item: '', amount: 10 },
    ]);
  });

  it('focuses the new split row\'s category dropdown after committing', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container, getAllByRole } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: '10' } });
    await fireEvent.keyDown(interimInput, { key: 'Enter', shiftKey: true });

    expect(document.activeElement).toBe(getAllByRole('combobox')[1]);
  });

  it('adds tax to the committed amount on Enter and subtracts the taxed amount', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: '10' } });
    await fireEvent.keyDown(interimInput, { key: 'Enter' });

    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 31.2 },
      { category: 'Food', item: '', amount: 11.3 },
    ]);
  });

  it('inserts a zero-amount row for invalid input, leaving the first row unchanged', async () => {
    const editTransactions:EditTransaction[] = reactiveArray([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
    ]);
    const { container } = render(EditGrid, {
      props: { editTransactions },
    });
    await fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    const interimInput = container.querySelectorAll('input.text-right')[1] as HTMLInputElement;

    await fireEvent.input(interimInput, { target: { value: 'not a number' } });
    await fireEvent.keyDown(interimInput, { key: 'Enter' });

    expect(editTransactions).toEqual([
      { category: 'Food', item: 'Groceries', amount: 42.5 },
      { category: 'Food', item: '', amount: 0 },
    ]);
  });
});
