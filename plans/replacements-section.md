# Plan: replacements section

## Data model in `utils/replacements/engine.ts`

```ts
type Operator = '<'|'<='|'=='|'!='|'>='|'>'|'between';
type Comparison = { operator:Operator; values:number[] };
type Rule = { pattern:string; comparisons:Comparison[]; replacement:string };  // AND between comparisons
```

- Each rule maps one pattern to one replacement.
- Item rules and category rules use the same `Rule` type. Category rules have no comparisons.
- To match one of two amount conditions, use 2 rules with the same pattern and replacement.
- Convert `CATEGORY_REPLACEMENTS` and `ITEM_REPLACEMENTS` to `Rule[]` constants named `CATEGORY_RULES` and `ITEM_RULES` in `utils/replacements/rules.ts`.
- Add an `OPERATORS` registry: `Record<Operator, (amount, values) => boolean>`. `between` includes both ends.
- `doReplacement(item, amount, rules)`: the first matching rule wins.
  A rule matches if the pattern matches and `comparisons.every(...)` is true. An empty list is true.
  Remove the `date` parameter.

## Parser in `utils/parser.ts`

- `parseDom` and `applyReplacements` take the two rule lists as parameters.

## State in `App.svelte`

- Two `$state` lists start from deep copies of the constants.
- Keep the HTML and the dates. `buildTransactionGroups` runs only on the first load.
- An `applyRules` handler goes to `ReplacementsSection` as `onApplyRules`. There is no confirm.

## Apply in `App.svelte`

- `applyRules` applies the rules to each transaction group where `edited` is false. It does not change edited groups.
- The handler does not run `parseDom` again. It changes each group object directly:
  - The raw item is `group.original.originalItem ?? group.original.item`.
  - Call `applyReplacements(rawItem, group.original.amount, itemRules, categoryRules)`.
  - Set `group.original` to a new object with the same `date` and `amount` and the new `category` and `item`.
    Do not merge into the old object, because `applyReplacements` omits `originalItem` when no item rule matches.
  - Set `group.current` to one copy of the new `group.original`.
- Deleted groups stay deleted, because they are not in the array.
- Applying clears the selected group:
  - `selectedGroup` is state in `EditorSection`. After the loop, set `initialSelectedGroup` to `undefined` and set
    `transactionGroups` to a new array with the same groups. The `{#key}` block then rebuilds `EditorSection`.
  - Changes in the edit grid that are not saved are lost.

## Components in `components/ReplacementsSection/`

- `ReplacementsSection`: a collapse toggle that starts expanded, an apply button, and the item rule table and
  category rule table side by side.
- `RuleTable`: one row for each rule and an "add rule" button. A new row goes to the end.
  A `showComparisons` prop hides the comparison column for category rules.
- `RuleRow`: a pattern input, comparison rows with "and" labels, an "add comparison" button, a replacement input, and a
  delete button. The replacement input uses a `<datalist>` of the replacements that the table already uses.
- `ComparisonRow`: an operator select, 1 number input, or 2 number inputs for `between`, and a delete button.

## Scope limits

- No validation, no reorder, no tests, no S3.
- All edits are inline and apply to the state immediately.
