# CLAUDE.md

* Always favor using Svelte 5 runes.
* Keep Svelte components small. 100 lines is a good rule of thumb. Prefer building many components to compose together.
* If you add any new files, always add them to Git.
* Never use `<table>`.
* Always play it safe and ask questions.

## Code Style
* Do not omit semicolons.
* When importing multiple things from a module, keep them on the same line.
* When defining types for a variable or parameter, do not add spaces between the colons and pipe symbols.
  * Good: `const foo:string|undefined = 5;`
* Never destructure `$props()`. Always use it directly like `let props = $props();`.
* Always define the type for `$props()`.
* Never do single line if statements like `if (foo) return bar;`.

## CSS Style
* Always use the same padding, margin, and gap values.
  * If you use `p-1`, use `1` for everything else too like `pt-1`, `gap-1`, etc.