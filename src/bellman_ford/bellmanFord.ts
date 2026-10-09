/** Sentinel used for "unreachable" distances, mirroring Python's `sys.maxsize`. */
export const INFINITY = Number.MAX_SAFE_INTEGER;

export type WeightedEdge = [from: number, to: number, length: number];

// Exposed as a spy-able object so tests can assert which path-reconstruction strategy
// `shortestPath` dispatches to, the way the Python original patches these via
// `bellman_ford_module`. `shortestPath` must call these through
// `bellmanFordInternals.*`, not as bare function calls.
export const bellmanFordInternals = {
  shortestPathByRecursive(prevIndex: number[], targetIndex: number): number[] {
    if (prevIndex[targetIndex] === -1) {
      return [targetIndex]
    }

    return [...this.shortestPathByLoop(prevIndex, prevIndex[targetIndex]!), targetIndex]
  },
  shortestPathByLoop(prevIndex: number[], targetIndex: number): number[] {
    let currTargetIndex = targetIndex
    const stack: number[] = []

    while (currTargetIndex !== -1) {
      stack.push(currTargetIndex)
      currTargetIndex = prevIndex[currTargetIndex]!
    }

    return stack.reverse()
  },
};

/**
 * Computes single-source the shortest distances with the Bellman-Ford algorithm.
 *
 * @returns [distance, prevIndex, hasNegativeCycle]
 */
export function bellmanFord(
  edgeList: WeightedEdge[],
  startIndex: number,
): [distance: number[], prevIndex: number[], hasNegativeCycle: boolean] {
  const vertexCount = new Set(edgeList.flatMap(([from, to, _]) => [from, to])).size

  const distance: number[] = new Array(vertexCount).fill(Number.MAX_SAFE_INTEGER)
  const prevIndex: number[] = new Array(vertexCount).fill(-1)
  let hasNegativeCycle: boolean = false

  distance[startIndex] = 0

  for (let i = 0; i < vertexCount - 1; i++) {
    for (const [from, to, edgeLength] of edgeList) {
      const minCandidateDistance = distance[from]! + edgeLength
      if (distance[from]! < Number.MAX_SAFE_INTEGER && minCandidateDistance < distance[to]!) {
        distance[to] = minCandidateDistance
        prevIndex[to] = from
      }
    }
  }

  for (const [from, to, edgeLength] of edgeList) {
    const minCandidateDistance = distance[from]! + edgeLength
    if (distance[from]! < Number.MAX_SAFE_INTEGER && minCandidateDistance < distance[to]!) {
      hasNegativeCycle = true
      break;
    }
  }

  return [distance, prevIndex, hasNegativeCycle]
}

/**
 * Reconstructs the shortest path to `targetIndex` from the `prevIndex` table.
 *
 * Dispatches to a recursive implementation for short chains and a loop-based one for
 * long chains, since a worst-case (path-shaped) graph recurses as deep as the path is
 * long and could otherwise exceed the call stack.
 */
export function shortestPath(prevIndex: number[], targetIndex: number): number[] {
  if (prevIndex.length >= 500) {
    return bellmanFordInternals.shortestPathByLoop(prevIndex, targetIndex)
  }

  return bellmanFordInternals.shortestPathByRecursive(prevIndex, targetIndex)
}

export function printShortestPath(prevIndex: number[], targetIndex: number): void {
  const path = shortestPath(prevIndex, targetIndex);
  console.log(path.join(' -> '));
}
