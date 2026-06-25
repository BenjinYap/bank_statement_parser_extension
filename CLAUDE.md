# CLAUDE.md

* Always favor using Svelte 5 runes.
* Keep Svelte components small. 100 lines is a good rule of thumb. Prefer building many components to compose together.

## Code Style
* Do not omit semicolons.
* When importing multiple things from a module, keep them on the same line.
* When defining types for a variable or parameter, do not add spaces between the colons and pipe symbols.
  * Good: `const foo:string|undefined = 5;`