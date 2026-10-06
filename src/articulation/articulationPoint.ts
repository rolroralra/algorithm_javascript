import { notImplemented } from '../shared/notImplemented';

/**
 * Finds all articulation points (cut vertices) in an undirected graph given as an adjacency list.
 *
 * @param adjacencyList adjacencyList[i] holds the indices of vertices adjacent to vertex i
 * @returns the sorted list of articulation point indices
 */
export function articulationPoints(adjacencyList: number[][]): number[] {
  const isArticulationPoint: boolean[] = new Array(adjacencyList.length).fill(false)
  let visitSeq = 1
  let visited = new Array(adjacencyList.length).fill(0)


  function dfs(currIndex: number, isRoot: boolean = false): number {
    if (visited[currIndex] > 0) {
      return visited[currIndex]
    }

    visited[currIndex] = visitSeq++
    let minVisitSeq = visited[currIndex]
    let childCount = 0

    for (const nextIndex of adjacencyList[currIndex]!) {
      let minVisitSeqFromChild = visited[nextIndex]

      if (visited[nextIndex] == 0) {
        minVisitSeqFromChild = dfs(nextIndex)
        childCount++

        // 단절점은 등호들어가도됨
        if (!isRoot && minVisitSeqFromChild >= visited[currIndex]) {
          isArticulationPoint[currIndex] = true
        }
      }

      minVisitSeq = Math.min(minVisitSeq, minVisitSeqFromChild)
    }

    if (isRoot && childCount >= 2) {
      isArticulationPoint[currIndex] = true
    }

    return minVisitSeq
  }

  for (let i = 0; i < adjacencyList.length; i++) {
    if (visited[i] == 0) {
      dfs(i, true)
    }
  }

  return isArticulationPoint.flatMap((v, i) => v ? [i] : [])
}
