import { notImplemented } from '../shared/notImplemented';

/**
 * Returns true when `a` and `b` violate heap order and must be swapped (`a` is the
 * ancestor, `b` the descendant). The default `(a, b) => a > b` yields a MIN-heap:
 * an ancestor greater than its descendant is a violation.
 */
export type CompareFunction<T> = (a: T, b: T) => boolean;

const defaultCompareFunction: CompareFunction<number> = (a, b) => a > b;

export class Heap<T = number> {
  array: T[];
  compareFunction: CompareFunction<T>;

  constructor(
    inputArray: T[] | null = null,
    compareFunction: CompareFunction<T> = defaultCompareFunction as unknown as CompareFunction<T>,
  ) {
    this.array = inputArray ?? [];
    this.compareFunction = compareFunction;

    if (this.array.length > 0) {
      this.heapifyBottomUp();
    }
  }

  add(value: T): void {
    notImplemented('Heap.add');
  }

  pop(): T | null {
    notImplemented('Heap.pop');
  }

  peek(): T | null {
    return this.array.length > 0 ? this.array[0]! : null;
  }

  getMax(): T | null {
    return this.array.length > 0 ? this.array[0]! : null;
  }

  size(): number {
    return this.array.length;
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  isValidIndex(index: number): boolean {
    return index >= 0 && index < this.array.length;
  }

  childIndices(index: number): [number, number] {
    return [Heap.leftChildIndex(index), Heap.rightChildIndex(index)];
  }

  printHeap(): void {
    console.log(this.array);
  }

  private heapifyBottomUp(): void {
    notImplemented('Heap.heapifyBottomUp');
  }

  private heapifyTopDown(): void {
    notImplemented('Heap.heapifyTopDown');
  }

  private siftUp(index: number): void {
    notImplemented('Heap.siftUp');
  }

  private siftDown(index: number): void {
    notImplemented('Heap.siftDown');
  }

  static parentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  static leftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  static rightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /** Sorts `inputArray` in place using a scratch heap built from a copy of it. */
  static heapSort<T>(
    inputArray: T[],
    compareFunction: CompareFunction<T> = defaultCompareFunction as unknown as CompareFunction<T>,
  ): void {
    notImplemented('Heap.heapSort');
  }
}
