import {PriorityQueue} from "@datastructures-js/priority-queue";
import {Heap} from "@/heap/heap";

/** Sentinel used for "unreachable" distances, mirroring Python's `sys.maxsize`. */
export const INFINITY = Number.MAX_SAFE_INTEGER;

/** adjacencyList[i] holds [nextIndex, edgeLength] pairs for edges leaving vertex i. */
export type WeightedAdjacencyList = [nextIndex: number, edgeLength: number][][];

/** Dijkstra's algorithm backed by a priority-queue-style min-heap keyed on distance. */
export function dijkstraByPriorityQueue(
  adjacencyList: WeightedAdjacencyList,
  startIndex: number,
): [distance: number[], prevIndex: number[]] {
  const priorityQueue = new PriorityQueue((a: [index: number, edgeLength: number], b: [index: number, edgeLength: number]) => a[1] - b[1])
  const isVisited: boolean[] = new Array(adjacencyList.length).fill(false)
  const distance: number[] = new Array(adjacencyList.length).fill(Number.MAX_SAFE_INTEGER)
  const prevIndex: number[] = new Array(adjacencyList.length).fill(-1)

  distance[startIndex] = 0
  prevIndex[startIndex] = -1
  priorityQueue.enqueue([startIndex , distance[startIndex]])

  while (!priorityQueue.isEmpty()) {
    let [currIndex, currDistance] = priorityQueue.dequeue()!;

    if (isVisited[currIndex]) {
      continue;
    }

    isVisited[currIndex] = true

    for (let [nextIndex, nextEdgeLength] of adjacencyList[currIndex]!) {
      const nextDistance = currDistance + nextEdgeLength

      if (nextDistance < distance[nextIndex]!) {
        distance[nextIndex] = nextDistance
        prevIndex[nextIndex] = currIndex
        priorityQueue.enqueue([nextIndex, distance[nextIndex]])
      }
    }
  }

  return [distance, prevIndex]
}

/** Dijkstra's algorithm backed by a binary heap (functionally equivalent to the priority-queue version). */
export function dijkstraByHeapq(
  adjacencyList: WeightedAdjacencyList,
  startIndex: number,
): [distance: number[], prevIndex: number[]] {
  const distance: number[] = new Array(adjacencyList.length).fill(Number.MAX_SAFE_INTEGER)
  const prevIndex: number[] = new Array(adjacencyList.length).fill(-1)
  const isVisited: boolean[] = new Array(adjacencyList.length).fill(false)

  const heap = new Heap([], (a :[index: number, edgeLength: number], b: [index: number, edgeLength: number]) => a[1] > b[1])

  distance[startIndex] = 0
  prevIndex[startIndex] = -1
  heap.add([startIndex, distance[startIndex]])

  while (!heap.isEmpty()) {
    let [currIndex, currDistance] = heap.pop()!;

    if (isVisited[currIndex]) {
      continue;
    }

    isVisited[currIndex] = true

    for (const [nextIndex, nextEdgeLength] of adjacencyList[currIndex]!) {
      const nextDistance = currDistance + nextEdgeLength
      if (nextDistance < distance[nextIndex]!) {
        distance[nextIndex] = nextDistance
        prevIndex[nextIndex] = currIndex
        heap.add([nextIndex, distance[nextIndex]])
      }
    }
  }

  return [distance, prevIndex]
}

export function shortestPath(prevIndex: number[], targetIndex: number): number[] {
  const stack = []
  let currIndex = targetIndex

  while (currIndex >= 0) {
    stack.push(currIndex)
    currIndex = prevIndex[currIndex]!
  }

  return stack.reverse()
}
