import { describe, expect, it, vi } from 'vitest';
import {
  INFINITY,
  bellmanFord,
  bellmanFordInternals,
  shortestPath,
  type WeightedEdge,
} from '../../src/bellman_ford/bellmanFord';

/** prevIndex for a straight chain 0 -> 1 -> 2 -> ... -> size - 1. */
function chainPrevIndex(size: number): number[] {
  return [-1, ...Array.from({ length: size - 1 }, (_, i) => i)];
}

describe('bellmanFord', () => {
  it('start node distance is zero', () => {
    const [distance] = bellmanFord([[0, 1, 1], [1, 2, 2]], 0);
    expect(distance[0]).toBe(0);
  });

  it('finds shortest distances', () => {
    const edges: WeightedEdge[] = [[0, 1, 1], [1, 2, 2], [0, 2, 4], [2, 3, 1]];

    const [distance, , hasNegativeCycle] = bellmanFord(edges, 0);

    expect(distance).toEqual([0, 1, 3, 4]);
    expect(hasNegativeCycle).toBe(false);
  });

  it('reconstructs the shortest path', () => {
    const edges: WeightedEdge[] = [[0, 1, 1], [1, 2, 2], [0, 2, 4], [2, 3, 1]];

    const [, prevIndex] = bellmanFord(edges, 0);

    expect(shortestPath(prevIndex, 3)).toEqual([0, 1, 2, 3]);
  });

  it('handles negative edge weights', () => {
    const edges: WeightedEdge[] = [[0, 1, 4], [0, 2, 5], [1, 2, -3]];

    const [distance, , hasNegativeCycle] = bellmanFord(edges, 0);

    expect(distance).toEqual([0, 4, 1]);
    expect(hasNegativeCycle).toBe(false);
  });

  it('detects a negative cycle', () => {
    const edges: WeightedEdge[] = [[0, 1, 1], [1, 2, -3], [2, 0, 1]];

    const [, , hasNegativeCycle] = bellmanFord(edges, 0);

    expect(hasNegativeCycle).toBe(true);
  });

  it('keeps an infinite distance for an unreachable node', () => {
    const edges: WeightedEdge[] = [[0, 1, 1], [2, 3, 1]];

    const [distance] = bellmanFord(edges, 0);

    expect(distance[2]).toBe(INFINITY);
    expect(distance[3]).toBe(INFINITY);
  });
});

// `shortestPath` switches from a recursive to a loop-based path reconstruction once
// `prevIndex` holds 500 or more elements, mirroring the Python original's threshold
// (see bellmanFord.ts). See the "at threshold" test below for the regression coverage
// this guards against.
describe('shortestPath dispatch threshold', () => {
  function spyOn(name: 'shortestPathByRecursive' | 'shortestPathByLoop') {
    return vi.spyOn(bellmanFordInternals, name);
  }

  it('uses the recursive implementation below the threshold', () => {
    const recursiveSpy = spyOn('shortestPathByRecursive');
    const loopSpy = spyOn('shortestPathByLoop');

    shortestPath(new Array(499).fill(-1), 0);

    expect(recursiveSpy).toHaveBeenCalled();
    expect(loopSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('uses the loop implementation at the threshold', () => {
    const recursiveSpy = spyOn('shortestPathByRecursive');
    const loopSpy = spyOn('shortestPathByLoop');

    shortestPath(new Array(500).fill(-1), 0);

    expect(loopSpy).toHaveBeenCalled();
    expect(recursiveSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('uses the loop implementation above the threshold', () => {
    const recursiveSpy = spyOn('shortestPathByRecursive');
    const loopSpy = spyOn('shortestPathByLoop');

    shortestPath(new Array(501).fill(-1), 0);

    expect(loopSpy).toHaveBeenCalled();
    expect(recursiveSpy).not.toHaveBeenCalled();
    recursiveSpy.mockRestore();
    loopSpy.mockRestore();
  });

  it('recursive implementation reconstructs a short chain', () => {
    const size = 400;
    expect(shortestPath(chainPrevIndex(size), size - 1)).toEqual(
      Array.from({ length: size }, (_, i) => i),
    );
  });

  it('loop implementation reconstructs a long chain without stack overflow', () => {
    // Far longer than any reasonable recursion depth; only the loop-based
    // implementation should be able to handle it.
    const size = 5000;
    expect(shortestPath(chainPrevIndex(size), size - 1)).toEqual(
      Array.from({ length: size }, (_, i) => i),
    );
  });

  it('recursive implementation handles a worst-case chain right at the threshold', () => {
    const size = 499;
    expect(shortestPath(chainPrevIndex(size), size - 1)).toEqual(
      Array.from({ length: size }, (_, i) => i),
    );
  });
});
