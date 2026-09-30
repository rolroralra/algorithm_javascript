import { notImplemented } from '../shared/notImplemented';

/** Sentinel used for "unreachable" distances, mirroring Python's `sys.maxsize`. */
export const INFINITY = Number.MAX_SAFE_INTEGER;

/**
 * All-pairs shortest paths via Floyd-Warshall.
 *
 * @param adjacencyMatrix adjacencyMatrix[i][j] is the direct edge weight from i to j,
 *   or `INFINITY` if there is no direct edge
 * @returns [distance, prevIndex] matrices
 */
export function floydWarshall(
  adjacencyMatrix: number[][],
): [distance: number[][], prevIndex: number[][]] {
  notImplemented('floydWarshall');
}

/** Reconstructs the shortest path from `startIndex` to `targetIndex`, or `[]` if none exists. */
export function shortestPath(
  prevIndex: number[][],
  startIndex: number,
  targetIndex: number,
): number[] {
  notImplemented('shortestPath');
}
