/**
 * Returns true when `a` and `b` violate heap order and must be swapped (`a` is the
 * ancestor, `b` the descendant). The default `(a, b) => a > b` yields a MIN-heap:
 * an ancestor greater than its descendant is a violation.
 */
export type CompareFunction<T> = (a: T, b: T) => boolean;

const defaultCompareFunction: CompareFunction<number> = (a, b) => a > b;

export class Heap<T = number> {
  array: T[];
  comp: CompareFunction<T>;

  constructor(
    inputArray: T[] | null = null,
    comp: CompareFunction<T> = defaultCompareFunction as unknown as CompareFunction<T>,
  ) {
    this.array = inputArray ?? [];
    this.comp = comp;

    if (this.array.length > 0) {
      this.heapifyBottomUp();
    }
  }

  add(value: T): void {
    this.array.push(value)
    this.siftUp(this.array.length - 1)
  }

  pop(): T | null {
    if (this.isEmpty()) {
      return null
    }

    if (this.array.length == 1) {
      return this.array.pop()!
    }

    const result = this.peek()
    this.array[0] = this.array.pop()!
    this.siftDown(0)

    return result
  }

  peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.array[0]!
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
    for (let i = Heap.parentIndex(this.array.length - 1); i >= 0; i--) {
      this.siftDown(i)
    }
  }

  private heapifyTopDown(): void {
    for (let i = 1; i < this.array.length; i++) {
      this.siftUp(i)
    }
  }

  private siftUp(index: number): void {
    if (!this.isValidIndex(index) || index === 0) {
      return
    }

    const parentIndex = Heap.parentIndex(index)

    if (this.comp(this.array[parentIndex]!, this.array[index]!)) {
      [this.array[parentIndex], this.array[index]] = [this.array[index]!, this.array[parentIndex]!]
      this.siftUp(parentIndex)
    }
  }

  private siftDown(index: number): void {
    if (!this.isValidIndex(index)) {
      return
    }

    const [leftChildIndex, rightChildIndex] = this.childIndices(index)

    let candidateIndex = index

    if (this.isValidIndex(leftChildIndex) && this.comp(this.array[index]!, this.array[leftChildIndex]!)) {
      candidateIndex = leftChildIndex
    }

    if (this.isValidIndex(rightChildIndex) && this.comp(this.array[candidateIndex]!, this.array[rightChildIndex]!)) {
      candidateIndex = rightChildIndex
    }

    if (candidateIndex != index) {
      [this.array[index], this.array[candidateIndex]] = [this.array[candidateIndex]!, this.array[index]!]
      this.siftDown(candidateIndex)
    }
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
    let result: T[] = []
    const heap = new Heap(inputArray, compareFunction)
    while (!heap.isEmpty()) {
      result.push(heap.pop()!)
    }

    inputArray.splice(0, result.length, ...result)
  }
}
