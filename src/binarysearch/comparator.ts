export type Comparator<T> = (a: T, b: T) => number;

/** Works via `>`/`<` coercion, so it is only meaningful for naturally-orderable T (numbers, strings, ...). */
export function defaultComparator<T>(a: T, b: T): number {
  const greater = (a as unknown as number) > (b as unknown as number);
  const less = (a as unknown as number) < (b as unknown as number);
  return (greater ? 1 : 0) - (less ? 1 : 0);
}
