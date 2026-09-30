import { notImplemented } from '../shared/notImplemented';

/**
 * Depth-first traversal that marks visited nodes in `isVisited` in place.
 *
 * @param adjacentList adjacency list
 * @param isVisited mutated in place to record which nodes were visited
 * @param startIndex node to start the traversal from
 * @param recursive when true, use a recursive implementation; otherwise iterative (stack-based)
 */
export function dfs(
  adjacentList: number[][],
  isVisited: boolean[],
  startIndex = 0,
  recursive = false,
): void {
  notImplemented('dfs');
}
