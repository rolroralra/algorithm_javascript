import { notImplemented } from '../shared/notImplemented';

// Exposed as a spy-able object (rather than a bare function) so tests can override
// `prunning` the way the Python original swaps the module-level function out via
// monkeypatch. `backtracking` must call `backtrackingInternals.prunning()`, not a
// bare `prunning()` call, or the test's `vi.spyOn` override will be bypassed.
export const backtrackingInternals = {
  prunning(): boolean {
    return false;
  },
};

/**
 * Depth-first backtracking traversal that unmarks each node on the way back up.
 *
 * @param graph adjacency list
 * @param isVisited mutated in place to track the current path
 * @param currIndex current node index
 * @param args extra arguments forwarded to future recursive extensions
 */
export function backtracking(
  graph: number[][],
  isVisited: boolean[],
  currIndex: number,
  ...args: unknown[]
): void {
  if (backtrackingInternals.prunning()) {
    return;
  }

  if (isVisited[currIndex]) {
    return;
  }

  isVisited[currIndex] = true

  for (const nextIndex of graph[currIndex]!) {
    if (!isVisited[nextIndex]) {
      backtracking(graph, isVisited, nextIndex, ...args)
    }
  }

  isVisited[currIndex] = false
}
