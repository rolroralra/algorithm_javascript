import { notImplemented } from '../shared/notImplemented';

/**
 * Topological sort via recursive DFS with cycle detection (visited/finished coloring).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns [order, hasCycle] — `order` is only a valid topological order when `hasCycle` is false
 */
export function topologicalSortByDfsRecursive(adjacencyList: number[][]): [order: number[], hasCycle: boolean] {
  let hasCycle: boolean = false
  const stack: number[] = []
  const isVisited: boolean[] = new Array(adjacencyList.length).fill(false)
  const isFinished: boolean[] = new Array(adjacencyList.length).fill(false)

  function dfs(currIndex: number) {
    if (isVisited[currIndex]) {
      return
    }

    isVisited[currIndex] = true

    for (let nextIndex of adjacencyList[currIndex]!) {
      if (!isVisited[nextIndex]) {
        dfs(nextIndex);
      } else if (!isFinished[nextIndex]) {
        hasCycle = true
        return
      }
    }

    isFinished[currIndex] = true
    stack.push(currIndex)
  }

  for (let i = 0; i < adjacencyList.length; i++) {
    if (!isVisited[i]) {
      dfs(i)
    }
  }

  return [stack.reverse(), hasCycle]
}

/**
 * Topological sort via Kahn's algorithm (repeatedly removing in-degree-0 vertices).
 *
 * @param adjacencyList directed graph adjacency list
 * @returns [order, hasCycle] — `hasCycle` is true when fewer vertices were sorted than exist,
 *   meaning some vertices were stuck in a cycle
 */
export function topologicalSortByIndegree(adjacencyList: number[][]): [result: number[], hasCycle: boolean] {
  let inDegree: number[] = new Array(adjacencyList.length).fill(0)

  // Initialize inDegree information on Graph
  for (const element of adjacencyList) {
    for (let i of element!) {
      inDegree[i]!++;
    }
  }

  const queue: number[] = []
  for (let i = 0; i < adjacencyList.length; i++) {
    if (inDegree[i] === 0) {
      queue.push(i)
    }
  }

  const result: number[] = []
  while (queue.length > 0) {
    let currIndex = queue.shift()!;

    result.push(currIndex)

    for (let nextIndex of adjacencyList[currIndex]!) {
      inDegree[nextIndex]!--;
      if (inDegree[nextIndex] === 0) {
        queue.push(nextIndex)
      }
    }
  }

  return [result, result.length !== adjacencyList.length]
}
