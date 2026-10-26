# Plan: replacements section

## Data model in `utils/replacements.ts`

```ts
type Operator = '<'|'<='|'=='|'!='|'>='|'>'|'between';
type Comparison = { operator:Operator; values:number[] };
type AmountFilter = { comparisons:Comparison[] };  // AND
type Condition = { pattern:string; filters:AmountFilter[] };  // OR
type Replacement = { name:string; conditions:Condition[] };
```

- Convert `CATEGORY_REPLACEMENTS` and `ITEM_REPLACEMENTS` to `Replacement[]`.
- Add an `OPERATORS` registry: `Record<Operator, { valueCount:number; evaluate:(amount, values) => boolean }>`.
  `between` includes both ends.
- `doReplacement(item, amount, replacements)`: the first replacement with a matching condition wins.
  A condition matches if the pattern matches and `filters` is empty or `filters.some(every comparison)` is true.
  Remove the `date` parameter.

## Parser in `utils/parser.ts`

- `parseDom` and `applyReplacements` take the two replacement lists as parameters.

## State in `App.svelte`

- Two `$state` lists start from deep copies of the constants.
- Keep the HTML and the dates. An `applyReplacements` handler runs `parseDom` again and rebuilds the transaction
  groups. There is no confirm.

## Components in `components/ReplacementsSection/`

- `ReplacementsSection`: a collapse toggle that starts expanded, an apply button, and the item list and category
  list side by side.
- `ReplacementList`: rows and an "add replacement" button. A new row goes to the end.
- `ReplacementRow`: a name input, condition rows, an "add condition" button, and a delete button.
- `ConditionRow`: a pattern input, filter boxes with "or" labels, an "add filter" button, and a delete button.
- `AmountFilterBox`: comparison rows with "and" labels, an "add comparison" button, and a delete button.
- `ComparisonRow`: an operator select, 1 or 2 number inputs from `valueCount`, and a delete button.

## Scope limits

- No validation, no reorder, no tests, no S3.
- All edits are inline and apply to the state immediately.
