import { notImplemented } from '../shared/notImplemented';

/**
 * Topological sort via recursive DFS with cycle detection (visited/finished coloring).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns [order, hasCycle] — `order` is only a valid topological order when `hasCycle` is false
 */
export function topologicalSortByDfsRecursive(adjacencyList: number[][]): [order: number[], hasCycle: boolean] {
  notImplemented('topologicalSortByDfsRecursive');
}

/**
 * Topological sort via Kahn's algorithm (repeatedly removing in-degree-0 vertices).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns [order, hasCycle] — `hasCycle` is true when fewer vertices were sorted than exist,
 *   meaning some vertices were stuck in a cycle
 */
export function topologicalSortByIndegree(adjacencyList: number[][]): [order: number[], hasCycle: boolean] {
  notImplemented('topologicalSortByIndegree');
}
