import { describe, expect, it, vi } from 'vitest';
import { Heap } from '@/heap/heap';
import { mulberry32, randomInt } from '../helpers/random';

describe('Heap basics', () => {
  it('a new heap is empty', () => {
    const heap = new Heap();
    expect(heap.isEmpty()).toBe(true);
    expect(heap.size()).toBe(0);
    expect(heap.peek()).toBeNull();
    expect(heap.pop()).toBeNull();
  });

  it('add and peek', () => {
    const heap = new Heap();
    heap.add(5);
    heap.add(1);
    heap.add(3);

    expect(heap.peek()).toBe(1);
    expect(heap.size()).toBe(3);
  });

  it('initializes from an input array', () => {
    const heap = new Heap([5, 1, 3, 2, 4]);
    expect(heap.size()).toBe(5);
    expect(heap.peek()).toBe(1);
  });
});

describe('Heap pop order', () => {
  it('the default comparator pops ascending', () => {
    const heap = new Heap<number>();
    for (const value of [3, 1, 4, 1, 5, 9, 2, 6]) {
      heap.add(value);
    }

    const result = Array.from({ length: heap.size() }, () => heap.pop());
    expect(result).toEqual([...[3, 1, 4, 1, 5, 9, 2, 6]].sort((a, b) => a - b));
  });

  it('a reversed comparator pops descending', () => {
    const heap = new Heap<number>(null, (a, b) => a < b);
    for (const value of [3, 1, 4, 1, 5, 9, 2, 6]) {
      heap.add(value);
    }

    const result: (number | null)[] = [];
    while (!heap.isEmpty()) {
      result.push(heap.pop());
    }

    expect(result).toEqual([...[3, 1, 4, 1, 5, 9, 2, 6]].sort((a, b) => b - a));
  });

  it('popping empties the heap', () => {
    const heap = new Heap([1, 2, 3]);
    while (!heap.isEmpty()) {
      heap.pop();
    }

    expect(heap.isEmpty()).toBe(true);
    expect(heap.pop()).toBeNull();
  });

  it.each(Array.from({ length: 10 }, (_, seed) => seed))(
    'matches sorted order on random input (seed %i)',
    (seed) => {
      const random = mulberry32(seed);
      const values = Array.from({ length: 60 }, () => randomInt(random, -100, 100));

      const heap = new Heap<number>();
      for (const value of values) {
        heap.add(value);
      }

      const popped = Array.from({ length: values.length }, () => heap.pop());
      expect(popped).toEqual([...values].sort((a, b) => a - b));
    },
  );
});

describe('Heap.heapSort', () => {
  it('sorts ascending by default', () => {
    const array = [5, 3, 8, 1, 9, 2, 7];
    Heap.heapSort(array);
    expect(array).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('sorts descending with a custom comparator', () => {
    const array = [5, 3, 8, 1, 9, 2, 7];
    Heap.heapSort(array, (a, b) => a < b);
    expect(array).toEqual([9, 8, 7, 5, 3, 2, 1]);
  });

  it('handles an empty array', () => {
    const array: number[] = [];
    Heap.heapSort(array);
    expect(array).toEqual([]);
  });
});

describe('Heap sift strategy dispatch (size > 1000 uses loop, otherwise recursive)', () => {
  const LOOP_THRESHOLD = 1000;

  it('stays on the recursive siftUp/siftDown while size is at or below the threshold', () => {
    const siftUpByLoop = vi.spyOn(Heap.prototype as any, 'siftUpByLoop');
    const siftUpByRecursive = vi.spyOn(Heap.prototype as any, 'siftUpByRecursive');
    const siftDownByLoop = vi.spyOn(Heap.prototype as any, 'siftDownByLoop');
    const siftDownByRecursive = vi.spyOn(Heap.prototype as any, 'siftDownByRecursive');

    const heap = new Heap<number>();
    for (let i = 0; i < LOOP_THRESHOLD; i++) {
      heap.add(i);
    }
    heap.pop();

    expect(siftUpByLoop).not.toHaveBeenCalled();
    expect(siftDownByLoop).not.toHaveBeenCalled();
    expect(siftUpByRecursive).toHaveBeenCalled();
    expect(siftDownByRecursive).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('switches to the loop-based siftUp/siftDown once size exceeds the threshold', () => {
    const siftUpByLoop = vi.spyOn(Heap.prototype as any, 'siftUpByLoop');
    const siftDownByLoop = vi.spyOn(Heap.prototype as any, 'siftDownByLoop');

    const heap = new Heap<number>();
    for (let i = 0; i < LOOP_THRESHOLD + 2; i++) {
      heap.add(i);
    }
    heap.pop();

    expect(siftUpByLoop).toHaveBeenCalled();
    expect(siftDownByLoop).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('matches sorted order through the loop-based path for a large heap', () => {
    const random = mulberry32(42);
    const values = Array.from({ length: LOOP_THRESHOLD + 500 }, () => randomInt(random, -1000, 1000));

    const heap = new Heap<number>();
    for (const value of values) {
      heap.add(value);
    }

    const popped = Array.from({ length: values.length }, () => heap.pop());
    expect(popped).toEqual([...values].sort((a, b) => a - b));
  });

  it('Heap.heapSort stays correct for input larger than the loop threshold', () => {
    const random = mulberry32(7);
    const array = Array.from({ length: LOOP_THRESHOLD + 500 }, () => randomInt(random, -1000, 1000));
    const expected = [...array].sort((a, b) => a - b);

    Heap.heapSort(array);

    expect(array).toEqual(expected);
  });
});
