import { notImplemented } from '../../shared/notImplemented';

/**
 * Sum-only segment tree built directly over `[0, capacity - 1]` (no power-of-two
 * padding). Named `BinaryIndexTree` here (the Python original reuses the name
 * `SegmentTree` for this variant, which would collide with ../segmentTree.ts).
 */
export class BinaryIndexTree {
  capacity: number;
  tree: number[];

  constructor(capacity = 10) {
    this.capacity = capacity;

    let size = 1;
    while (size < capacity) {
      size *= 2;
    }
    size = size * 2 - 1;

    this.tree = new Array<number>(size).fill(0);
  }

  update(index: number, value: number): void {
    notImplemented('BinaryIndexTree.update');
  }

  query(leftIndex: number, rightIndex: number): number {
    notImplemented('BinaryIndexTree.query');
  }
}
