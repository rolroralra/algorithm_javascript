import { describe, expect, it } from 'vitest';
import { Heap } from '../../src/heap/heap';
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
