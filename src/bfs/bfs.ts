/**
 * Breadth-first traversal starting from `startIndex`. Mirrors the Python original:
 * visitation state stays internal and the function returns nothing.
 *
 * @param graph adjacency list representation of the graph
 * @param isVisited mutated in place to record which nodes were visited
 * @param startIndex node to start the traversal from
 *
 * @throws RangeError if `startIndex` is out of bounds for `graph`
 */
export function bfs(graph: number[][], isVisited: boolean[], startIndex: number): void {
  if (startIndex < 0 || startIndex >= graph.length) {
    throw new RangeError('startIndex is out of bounds for the graph');
  }

  let queue: number[] = [];

  isVisited[startIndex] = true
  queue.unshift(startIndex)

  while (queue.length > 0) {
    let currIndex = queue.shift()!;

    // visit process

    for (let nextIndex of graph[currIndex]!) {
      if (isVisited[nextIndex]) {
        continue;
      }

      queue.unshift(nextIndex)
      isVisited[nextIndex] = true
    }
  }

}
