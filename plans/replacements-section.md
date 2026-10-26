# Plan: replacements section

## Data model in `utils/replacements/engine.ts`

```ts
type Operator = '<'|'<='|'=='|'!='|'>='|'>'|'between';
type Comparison = { operator:Operator; values:number[] };
type AmountFilter = { comparisons:Comparison[] };  // AND
type Rule = { pattern:string; filters:AmountFilter[]; replacement:string };  // OR between filters
```

- Each rule maps one pattern to one replacement.
- Item rules and category rules use the same `Rule` type. Category rules have no filters.
- Convert `CATEGORY_REPLACEMENTS` and `ITEM_REPLACEMENTS` to `Rule[]`.
- Add an `OPERATORS` registry: `Record<Operator, (amount, values) => boolean>`. `between` includes both ends.
- `doReplacement(item, amount, rules)`: the first matching rule wins.
  A rule matches if the pattern matches and `filters` is empty or `filters.some(every comparison)` is true.
  Remove the `date` parameter.

## Parser in `utils/parser.ts`

- `parseDom` and `applyReplacements` take the two rule lists as parameters.

## State in `App.svelte`

- Two `$state` lists start from deep copies of the constants.
- Keep the HTML and the dates. An `applyReplacements` handler runs `parseDom` again and rebuilds the transaction
  groups. There is no confirm.

## Components in `components/ReplacementsSection/`

- `ReplacementsSection`: a collapse toggle that starts expanded, an apply button, and the item rule table and
  category rule table side by side.
- `RuleTable`: one row for each rule and an "add rule" button. A new row goes to the end.
  A `showFilters` prop hides the filter column for category rules.
- `RuleRow`: a pattern input, filter boxes with "or" labels, an "add filter" button, a replacement input, and a
  delete button. The replacement input uses a `<datalist>` of the replacements that the table already uses.
- `AmountFilterBox`: comparison rows with "and" labels, an "add comparison" button, and a delete button.
- `ComparisonRow`: an operator select, 1 number input, or 2 number inputs for `between`, and a delete button.

## Scope limits

- No validation, no reorder, no tests, no S3.
- All edits are inline and apply to the state immediately.
