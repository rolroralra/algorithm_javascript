import { notImplemented } from '../shared/notImplemented';

/** Sentinel used for "unreachable" distances, mirroring Python's `sys.maxsize`. */
export const INFINITY = Number.MAX_SAFE_INTEGER;

export type WeightedEdge = [from: number, to: number, length: number];

// Exposed as a spy-able object so tests can assert which path-reconstruction strategy
// `shortestPath` dispatches to, the way the Python original patches these via
// `bellman_ford_module`. `shortestPath` must call these through
// `bellmanFordInternals.*`, not as bare function calls.
export const bellmanFordInternals = {
  shortestPathByRecursive(prevIndex: number[], targetIndex: number): number[] {
    notImplemented('bellmanFordInternals.shortestPathByRecursive');
  },
  shortestPathByLoop(prevIndex: number[], targetIndex: number): number[] {
    notImplemented('bellmanFordInternals.shortestPathByLoop');
  },
};

/**
 * Computes single-source shortest distances with the Bellman-Ford algorithm.
 *
 * @returns [distance, prevIndex, hasNegativeCycle]
 */
export function bellmanFord(
  edgeList: WeightedEdge[],
  startIndex: number,
): [distance: number[], prevIndex: number[], hasNegativeCycle: boolean] {
  notImplemented('bellmanFord');
}

/**
 * Reconstructs the shortest path to `targetIndex` from the `prevIndex` table.
 *
 * Dispatches to a recursive implementation for short chains and a loop-based one for
 * long chains, since a worst-case (path-shaped) graph recurses as deep as the path is
 * long and could otherwise exceed the call stack.
 */
export function shortestPath(prevIndex: number[], targetIndex: number): number[] {
  notImplemented('shortestPath');
}

export function printShortestPath(prevIndex: number[], targetIndex: number): void {
  const path = shortestPath(prevIndex, targetIndex);
  console.log(path.join(' -> '));
}
