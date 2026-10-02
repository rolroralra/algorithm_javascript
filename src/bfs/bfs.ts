/**
 * Breadth-first traversal starting from `startIndex`. Mirrors the Python original:
 * visitation state stays internal and the function returns nothing.
 *
 * @param graph adjacency list representation of the graph
 * @param startIndex node to start the traversal from
 *
 * @throws RangeError if `startIndex` is out of bounds for `graph`
 */
export function bfs(graph: number[][], startIndex: number): void {
  if (startIndex < 0 || startIndex >= graph.length) {
    throw new RangeError('startIndex is out of bounds for the graph');
  }

  let isVisited: boolean[] = new Array(graph.length).fill(false);
  let queue: number[] = [];

  isVisited[startIndex] = true
  queue.unshift(startIndex)

  while (queue.length > 0) {
    let currIndex = queue.shift()!;

    // visit process

    for (let [value, nextIndex] of graph[currIndex]!.entries()) {
      if (!value) {
        continue
      }

      queue.unshift(nextIndex)
      isVisited[nextIndex] = true
    }
  }

}
