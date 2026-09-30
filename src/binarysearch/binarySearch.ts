import { notImplemented } from '../shared/notImplemented';

/**
 * Binary search over a sorted array.
 *
 * @param recursive when true, use a recursive implementation; otherwise iterative
 * @returns the index of `targetValue` if found; otherwise `-(insertionPoint + 1)`,
 *   where `insertionPoint` is where `targetValue` would need to be inserted to keep
 *   the array sorted
 */
export function binarySearch(
  sortedArray: number[],
  targetValue: number,
  recursive = false,
): number {
  notImplemented('binarySearch');
}
