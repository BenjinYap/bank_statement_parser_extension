export function reactiveArray<T>(items:T[]):T[] {
  let state:T[] = $state(items);
  return state;
}
