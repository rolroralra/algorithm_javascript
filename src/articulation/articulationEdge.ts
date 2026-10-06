import { notImplemented } from '@/shared/notImplemented';
import {PriorityQueue} from "@datastructures-js/priority-queue";

/**
 * Finds all articulation edges (bridges) in an undirected graph given as an adjacency list.
 *
 * @param adjacencyList adjacencyList[i] holds the indices of vertices adjacent to vertex i
 * @returns the list of bridge edges as [min(u, v), max(u, v)] pairs
 */
export function articulationEdges(adjacencyList: number[][]): [number, number][] {
  const result: [number, number][] = []
  let visitSeq = 1
  const visited: number[] = new Array(adjacencyList.length).fill(0)

  function dfs(currIndex: number, prevIndex: number = -1): number {
    if (visited[currIndex]! > 0) {
      return visited[currIndex]!
    }

    visited[currIndex] = visitSeq++
    let minVisitSeq = visited[currIndex]

    for (const nextIndex of adjacencyList[currIndex]!) {
      // 중요한 조건!!!
      if (nextIndex === prevIndex) {
        continue
      }

      let minVisitSeqFromChild = visited[nextIndex]!

      if (visited[nextIndex] == 0) {
        minVisitSeqFromChild = dfs(nextIndex ,currIndex)

        // 등호 들어가면 절대 안됨!
        if (minVisitSeqFromChild > visited[currIndex]) {
          result.push(currIndex > nextIndex ? [nextIndex, currIndex] : [currIndex, nextIndex])
        }
      }

      minVisitSeq = Math.min(minVisitSeq, minVisitSeqFromChild)
    }

    return minVisitSeq
  }

  for (let i = 0; i < adjacencyList.length; i++) {
    if (visited[i] == 0) {
      dfs(i)
    }
  }

  return result
}
