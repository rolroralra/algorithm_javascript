import { notImplemented } from '../shared/notImplemented';

/** Sentinel used for "unreachable" distances, mirroring Python's `sys.maxsize`. */
export const INFINITY = Number.MAX_SAFE_INTEGER;

/** adjacencyList[i] holds [nextIndex, edgeLength] pairs for edges leaving vertex i. */
export type WeightedAdjacencyList = [nextIndex: number, edgeLength: number][][];

/** Dijkstra's algorithm backed by a priority-queue-style min-heap keyed on distance. */
export function dijkstraByPriorityQueue(
  adjacencyList: WeightedAdjacencyList,
  startIndex: number,
): [distance: number[], prevIndex: number[]] {
  notImplemented('dijkstraByPriorityQueue');
}

/** Dijkstra's algorithm backed by a binary heap (functionally equivalent to the priority-queue version). */
export function dijkstraByHeapq(
  adjacencyList: WeightedAdjacencyList,
  startIndex: number,
): [distance: number[], prevIndex: number[]] {
  notImplemented('dijkstraByHeapq');
}

export function shortestPath(prevIndex: number[], targetIndex: number): number[] {
  notImplemented('shortestPath');
}
