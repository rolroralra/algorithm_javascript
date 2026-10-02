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

  if (recursive) {
    let isFinished = new Array(isVisited.length).fill(false);
    dfsWithRecursive(startIndex, adjacentList, isVisited, isFinished);
    return;
  }

  dfsWithLoop(adjacentList, isVisited, startIndex)
}

function dfsWithRecursive(
    currIndex: number,
    adjacentList: number[][],
    isVisited: boolean[],
    isFinished: boolean[]
): void {
  if (isVisited[currIndex]) {
    return;
  }

  isVisited[currIndex] = true;

  // visit process

  for (let nextIndex of adjacentList[currIndex]!) {
    if (isVisited[nextIndex]) {
      continue;
    }

    dfsWithRecursive(nextIndex, adjacentList, isVisited, isFinished);
  }

  isFinished[currIndex] = true;

  // finish process
}

function dfsWithLoop(
    adjacentList: number[][],
    isVisited: boolean[],
    startIndex = 0,
): void {
  let stack: number[] = []

  stack.push(startIndex);
  isVisited[startIndex] = true

  // visit process

  while (stack.length > 0) {
    const currIndex = stack.pop()!

    for (let nextIndex of adjacentList[currIndex]!) {
      if (isVisited[nextIndex]) {
        continue;
      }

      stack.push(nextIndex);
      isVisited[nextIndex] = true;
    }
  }
}
