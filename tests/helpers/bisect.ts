// Linear-scan reference implementations standing in for Python's `bisect` module,
// used only to cross-check the binary-search-based lowerBound/upperBound in tests.

/** Equivalent to Python's `bisect.bisect_left`. */
export function bruteForceLowerBound(sortedArray: number[], targetValue: number): number {
  let index = 0;
  while (index < sortedArray.length && sortedArray[index]! < targetValue) {
    index += 1;
  }
  return index;
}

/** Equivalent to Python's `bisect.bisect_right`. */
export function bruteForceUpperBound(sortedArray: number[], targetValue: number): number {
  let index = 0;
  while (index < sortedArray.length && sortedArray[index]! <= targetValue) {
    index += 1;
  }
  return index;
}
