import { notImplemented } from '../shared/notImplemented';
import { randomInt } from "node:crypto";

/** "Should swap a before b" predicate — true means a belongs after b. Default sorts ascending. */
export type SortComparator = (a: number, b: number) => boolean;

const defaultComparator: SortComparator = (a, b) => a > b;

export type SortAlgorithm = (array: number[], comp?: SortComparator) => number[] | void;

export class Sort {
  static selectionSort(array: number[], comp: SortComparator = defaultComparator): void {
    for (let i = 0; i < array.length; i++) {
      let selectedIndex = i
      for (let j = i + 1; j < array.length; j++) {
        if (comp(array[selectedIndex]!, array[j]!)) {
          selectedIndex = j
        }
      }

      if (i == selectedIndex) {
        continue
      }

      [array[selectedIndex], array[i]] = [array[i]!, array[selectedIndex]!]
    }
  }

  static bubbleSort(array: number[], comp: SortComparator = defaultComparator): void {
    for (let i = 0; i < array.length - 1; i++) {
      let isSwapped = false
      for (let j = 0; j < array.length - i - 1; j++) {
        if (comp(array[j]!, array[j + 1]!)) {
          [array[j], array[j + 1]] = [array[j + 1]!, array[j]!]
          isSwapped = true
        }
      }

      if (!isSwapped) {
        break;
      }
    }
  }

  static insertionSort(array: number[], comp: SortComparator = defaultComparator): void {
    for (let i = 1; i < array.length; i++) {
      for (let j = i; j > 0; j--) {
        if (!comp(array[j - 1]!, array[j]!)) {
          break;
        }

        [array[j - 1], array[j]] = [array[j]!, array[j - 1]!]
      }
    }
  }

  static shellSort(array: number[], comp: SortComparator = defaultComparator): void {
    notImplemented('Sort.shellSort');
  }

  static mergeSort(array: number[], comp: SortComparator = defaultComparator): void {
    Sort.mergeSortInternal(array, 0, array.length, comp)
  }


  static quickSort(array: number[], comp: SortComparator = defaultComparator): void {
    Sort.quickSortInternal(array, 0, array.length, comp)
  }

  /** Should delegate to `Heap.heapSort` from '../heap/heap', mirroring the Python original. */
  static heapSort(array: number[], comp: SortComparator = defaultComparator): void {
    notImplemented('Sort.heapSort');
  }

  static countingSort(array: number[]): number[] {
    notImplemented('Sort.countingSort');
  }

  static radixSort(array: number[], base = 10): number[] {
    notImplemented('Sort.radixSort');
  }

  /**
   * Distributes elements into buckets by value magnitude, then sorts each bucket with
   * `insertionSort` — comparison-based overall, like the other algorithms above,
   * despite also returning the sorted array (like the non-comparison algorithms do).
   */
  static bucketSort(array: number[], comp: SortComparator = defaultComparator, bucketCount?: number): number[] {
    notImplemented('Sort.bucketSort');
  }

  /**
   * Dispatches to `algorithm`, returning a freshly sorted copy of `array` (input is
   * never mutated). The Python original inspects `algorithm`'s parameter names via
   * `inspect.signature` to decide whether it needs a comparator; JS/TS has no
   * equivalent reliable runtime parameter-name introspection, so the real
   * implementation needs its own way to tell comparison-based algorithms (which take
   * `comp`) apart from non-comparison ones (`countingSort`/`radixSort`) — e.g. an
   * explicit tag or a lookup table, rather than reflection.
   */
  static sort(
    array: number[] | null = null,
    comp: SortComparator = defaultComparator,
    algorithm: SortAlgorithm = Sort.quickSort,
  ): number[] {
    if (!array) {
      return []
    }

    // let clonedArray = [...array]
    let clonedArray = structuredClone(array)
    Sort.selectionSort(clonedArray, comp)
    return clonedArray
  }

  static swap(array: unknown[], index1: number, index2: number): void {
    if (index1 === index2) return;

    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  private static mergeSortInternal(array: number[], startIndexInclusive: number = 0, endIndexExclusive: number = array.length, comp: SortComparator = defaultComparator): void {
    if (startIndexInclusive >= endIndexExclusive - 1) {
      return
    }

    const midIndex = Math.floor((startIndexInclusive + endIndexExclusive) / 2)

    Sort.mergeSortInternal(array, startIndexInclusive, midIndex, comp)
    Sort.mergeSortInternal(array, midIndex, endIndexExclusive, comp)
    Sort.merge(array, startIndexInclusive, endIndexExclusive, comp)
  }

  private static merge(array: number[], startIndexInclusive: number, endIndexExclusive: number, comp: SortComparator = defaultComparator) {
    let sortedArray = array.slice(startIndexInclusive, endIndexExclusive)

    const midIndex = Math.floor((startIndexInclusive + endIndexExclusive) / 2)
    let [i, j, k] = [startIndexInclusive, midIndex, 0]

    while (i < midIndex && j < endIndexExclusive) {
      if (comp(array[i]!, array[j]!)) {
        sortedArray[k++] = array[j++]!
      } else {
        sortedArray[k++] = array[i++]!
      }
    }

    while(i < midIndex) {
      sortedArray[k++] = array[i++]!
    }

    while (j < endIndexExclusive) {
      sortedArray[k++] = array[j++]!
    }

    array.splice(startIndexInclusive, sortedArray.length, ...sortedArray)
  }

  private static quickSortInternal(array: number[], startIndexInclusive: number = 0, endIndexExclusive: number = array.length, comp: SortComparator = defaultComparator) {
    if (startIndexInclusive >= endIndexExclusive - 1) {
      return
    }

    const pivotIndex = randomInt(endIndexExclusive - startIndexInclusive) + startIndexInclusive;
    [array[startIndexInclusive], array[pivotIndex]] = [array[pivotIndex]!, array[startIndexInclusive]!]

    let j = startIndexInclusive
    for (let i = startIndexInclusive; i < endIndexExclusive; i++) {
      if (comp(array[startIndexInclusive]!, array[i]!)) {
        j++;
        [array[i], array[j]] = [array[j]!, array[i]!]
      }
    }

    [array[startIndexInclusive], array[j]] = [array[j]!, array[startIndexInclusive]!]

    Sort.quickSortInternal(array, startIndexInclusive, j, comp)
    Sort.quickSortInternal(array, j + 1, endIndexExclusive, comp)
  }
}
