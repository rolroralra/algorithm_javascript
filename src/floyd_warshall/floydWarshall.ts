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
  const distance: number[][] = Array.from({ length: adjacencyMatrix.length }, () =>
    new Array(adjacencyMatrix.length).fill(Number.MAX_SAFE_INTEGER),
  )
  const prevIndex: number[][] = Array.from({ length: adjacencyMatrix.length }, () =>
    new Array(adjacencyMatrix.length).fill(-1),
  )

  // Initialize
  for (let i = 0; i < adjacencyMatrix.length; i++) {
    distance[i]![i] = 0

    for (let j = 0; j < adjacencyMatrix.length; j++) {
      if (adjacencyMatrix[i]![j]! !== 0) {
        prevIndex[i]![j] = i
        distance[i]![j] = adjacencyMatrix[i]![j]!
      }
    }
  }

  // FloydWarshall Algorithm
  for (let k = 0; k < adjacencyMatrix.length; k++) {
    for (let i = 0; i < adjacencyMatrix.length; i++) {
      if (distance[i]![k] === Number.MAX_SAFE_INTEGER) {
        continue;
      }

      for (let j = 0; j < adjacencyMatrix.length; j++) {
        if (distance[k]![j] === Number.MAX_SAFE_INTEGER) {
          continue;
        }

        const candidateMinDistance = distance[i]![k]! + distance[k]![j]!

        if (candidateMinDistance < distance[i]![j]!) {
          distance[i]![j] = candidateMinDistance
          prevIndex[i]![j] = prevIndex[k]![j]!
        }
      }
    }
  }

  return [distance, prevIndex]
}

/** Reconstructs the shortest path from `startIndex` to `targetIndex`, or `[]` if none exists. */
export function shortestPath(
  prevIndex: number[][],
  startIndex: number,
  targetIndex: number,
): number[] {
  return shortestPathByLoop(prevIndex, startIndex, targetIndex)
}

function shortestPathByLoop(
    prevIndex: number[][],
    startIndex: number,
    targetIndex: number,
): number [] {
  if (prevIndex[startIndex]![targetIndex] === -1) {
    return []
  }

  let currTargetIndex = targetIndex
  const stack: number[] = []

  while (currTargetIndex !== startIndex) {
    stack.push(currTargetIndex)
    currTargetIndex = prevIndex[startIndex]![currTargetIndex]!
  }
  stack.push(startIndex)
  return stack.reverse()
}

function shortestPathByRecursive(
    prevIndex: number[][],
    startIndex: number,
    targetIndex: number,
): number [] {
  if (startIndex == targetIndex) {
    return [startIndex]
  }

  if (prevIndex[startIndex]![targetIndex] === -1) {
    return []
  }

  return [...shortestPathByRecursive(prevIndex, startIndex, prevIndex[startIndex]![targetIndex]!), targetIndex]
}

