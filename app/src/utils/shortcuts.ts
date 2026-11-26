type Modifier = 'ctrlKey'|'shiftKey'|'altKey';

// A key is a modifier, or a key that matches one of the event key values.
export type Key = { label:string; modifier:Modifier }|{ label:string; values:string[] };

export type Shortcut = {
  keys:Key[];
  actionName:string;
  // A shortcut without an action is only shown in the panel. An element handles the key itself.
  action?:() => void;
};

export const KEY_CTRL:Key = { label: 'Ctrl', modifier: 'ctrlKey' };
export const KEY_SHIFT:Key = { label: 'Shift', modifier: 'shiftKey' };
export const KEY_ENTER:Key = { label: 'Enter', values: ['Enter'] };
export const KEY_ESCAPE:Key = { label: 'Esc', values: ['Escape'] };
export const KEY_S:Key = { label: 'S', values: ['s'] };
// '=' is the same physical key as '+' without Shift.
export const KEY_PLUS:Key = { label: '+', values: ['+', '='] };
export const KEY_MINUS:Key = { label: '-', values: ['-'] };

// Only the scope at the top of the stack is active. The scopes under it get no keys.
const scopes:Shortcut[][] = [];

// Modifiers that are not in the keys are ignored. On many keyboards, '+' needs Shift.
function matches(event:KeyboardEvent, shortcut:Shortcut):boolean {
  return shortcut.keys.every((key) => {
    if ('modifier' in key) {
      return event[key.modifier];
    }

    return key.values.includes(event.key);
  });
}

// An element that handles a key calls preventDefault. Then the key is not also a shortcut.
// For example, Escape in the item name input cancels the name and does not close the receipt window.
function handleKeydown(event:KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  const activeScope:Shortcut[]|undefined = scopes.at(-1);
  const shortcut:Shortcut|undefined = activeScope?.find((candidate) => {
    return candidate.action !== undefined && matches(event, candidate);
  });
  if (shortcut === undefined) {
    return;
  }

  event.preventDefault();
  shortcut.action?.();
}

// Puts the shortcuts on top of the stack and returns the function that removes them.
// Call it in an $effect, so that the scope is removed when the component is destroyed.
export function registerShortcutScope(shortcuts:Shortcut[]):() => void {
  if (scopes.length === 0) {
    window.addEventListener('keydown', handleKeydown);
  }
  scopes.push(shortcuts);

  return () => {
    // A scope that is not at the top can be removed, so find it by identity.
    const index:number = scopes.indexOf(shortcuts);
    if (index !== -1) {
      scopes.splice(index, 1);
    }
    if (scopes.length === 0) {
      window.removeEventListener('keydown', handleKeydown);
    }
  };
}
