export type Key = {
  label:string;
};

export type Shortcut = {
  keys:Key[];
  actionName:string;
};

export const KEY_CTRL:Key = { label: 'Ctrl' };
export const KEY_SHIFT:Key = { label: 'Shift' };
export const KEY_ENTER:Key = { label: 'Enter' };
export const KEY_S:Key = { label: 'S' };
export const KEY_PLUS:Key = { label: '+' };
export const KEY_MINUS:Key = { label: '-' };
