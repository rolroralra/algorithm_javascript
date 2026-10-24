export type BinaryOperator<T> = (a: T, b: T) => T;

/**
 * Segment tree over an associative `binaryOperator` (sum by default). Internally uses
 * a complete-binary-tree array sized up to the next power of two, so `capacity`
 * (`size`) need not itself be a power of two.
 */
export class SegmentTree<T = number> {
  static readonly BASE_INDEX = 0;
  /** Sizes above this use the iterative (bottom-up) update/query; others use recursion. */
  static readonly LOOP_THRESHOLD_SIZE = 1000;

  operator: BinaryOperator<T>;
  identity: T;
  size: number;
  baseNodeIndex: number;
  treeSize: number;
  tree: (T | null)[];
  readonly rootNode: [node: number, left: number, right: number];

  constructor(
    size: number,
    binaryOperator: BinaryOperator<T> = ((a: number, b: number) => a + b) as unknown as BinaryOperator<T>,
    identity: T = 0 as unknown as T,
  ) {
    if (size <= 0) {
      throw new Error('size must be greater than 0');
    }

    this.operator = binaryOperator;
    this.identity = identity;
    this.size = size;

    const baseSize = 1 << Math.ceil(Math.log2(size));
    this.baseNodeIndex = baseSize - 1;
    this.treeSize = baseSize * 2 - 1;
    this.tree = new Array<T | null>(this.treeSize).fill(this.identity);
    this.rootNode = [SegmentTree.BASE_INDEX, 0, this.size - 1];
  }

  /**
   * Updates the value at `targetIndex` to `value`, and updates all ancestor nodes accordingly.
   * @param targetIndex the index of the element to be updated
   * @param value the new value to be set at the target index
   */
  update(targetIndex: number, value: T): void {
    if (this.size > SegmentTree.LOOP_THRESHOLD_SIZE) {
      this.updateByLoop(targetIndex, value);
      return;
    }

    this.updateByRecursive(this.rootSegmentNode(), targetIndex, value)
  }

  /**
   * Queries the segment tree for the result of applying the binary operator over the range [startIndexInclusive, endIndexInclusive].
   * @param startIndexInclusive start index of the query range (inclusive)
   * @param endIndexInclusive end index of the query range (inclusive)
   */
  query(startIndexInclusive: number, endIndexInclusive: number): T | null {
    if (this.size > SegmentTree.LOOP_THRESHOLD_SIZE) {
      return this.queryNodeByLoop(startIndexInclusive, endIndexInclusive)
    }

    return this.queryNodeByRecursive(this.rootSegmentNode(), startIndexInclusive, endIndexInclusive);
  }

  /**
   * Segment tree update by recursion. Updates the value at `targetIndex` to `value`, and updates all ancestor nodes accordingly.
   * <br><br>
   * This is based on Bottom-Up Segment Tree Construction and Update, as described in the [CP-Algorithms article](https://cp-algorithms.com/data_structures/segment_tree.html#bottom-up-segment-tree-construction-and-update).
   * @param node the current node in the segment tree
   * @param targetIndex The index of the element to be updated
   * @param value The new value to be set at the target index
   * @private
   */
  private updateByRecursive(node: SegmentNode, targetIndex: number, value: T): void {
    // If the target index is outside the range of this node, return
    if (node.doesNotContains(targetIndex)) {
      return;
    }

    // If this node is a leaf node, update the value and return
    if (node.isSegmentLeafNode()) {
      this.tree[node.nodeIndex] = value;
      return;
    }

    // Recursively update the left and right children
    let leftChildNode = node.leftChildNode();
    let rightChildNode = node.rightChildNode();

    if (leftChildNode.contains(targetIndex)) {
      this.updateByRecursive(leftChildNode, targetIndex, value)
    } else if (rightChildNode.contains(targetIndex)) {
      this.updateByRecursive(rightChildNode, targetIndex, value)
    }

    // Post-order update: after updating the child, update the current node's value based on its children
    this.tree[node.nodeIndex] = this.operator(this.getNodeValueOrIdentity(leftChildNode.nodeIndex),
        this.getNodeValueOrIdentity(rightChildNode.nodeIndex));
  }

  /**
   * Segment tree update by loop. Updates the value at `targetIndex` to `value`, and updates all ancestor nodes accordingly.
   * <br><br>
   * This is based on Bottom-Up Segment Tree Construction and Update, as described in the [CP-Algorithms article](https://cp-algorithms.com/data_structures/segment_tree.html#top-down-segment-tree-construction-and-update).
   * @param targetIndex
   * @param value
   * @private
   */
  private updateByLoop(targetIndex: number, value:T): void {
    let currNodeIndex = this.getSegmentNodeIndex(targetIndex)

    // Set the value at the leaf node corresponding to the target index
    this.tree[currNodeIndex] = value

    // Update all ancestor nodes
    while (currNodeIndex > SegmentTree.BASE_INDEX) {
      currNodeIndex = SegmentNode.parentNodeIndex(currNodeIndex)
      this.updateNode(currNodeIndex)
    }
  }

  /**
   * Updates the value of the node at `nodeIndex` based on its left and right children.
   * @param nodeIndex The index of the node to be updated
   * @private
   */
  private updateNode(nodeIndex: number) {
    let leftChildNodeIndex = SegmentNode.leftChildNodeIndex(nodeIndex);
    let rightChildNodeIndex = SegmentNode.rightChildNodeIndex(nodeIndex);

    this.tree[nodeIndex] = this.operator(this.getNodeValueOrIdentity(leftChildNodeIndex),
        this.getNodeValueOrIdentity(rightChildNodeIndex));
  }

  /**
   * Queries the segment tree for the result of applying the binary operator over the range [startIndexInclusive, endIndexInclusive].
   * <br><br>
   * This is based on Bottom-Up Segment Tree Construction and Update, as described in the [CP-Algorithms article](https://cp-algorithms.com/data_structures/segment_tree.html#bottom-up-segment-tree-construction-and-update).
   * @param node the current node in the segment tree
   * @param startIndexInclusive start index of the query range (inclusive)
   * @param endIndexInclusive end index of the query range (inclusive)
   * @private
   */
  private queryNodeByRecursive(node: SegmentNode, startIndexInclusive: number, endIndexInclusive: number): T{
    // If the current node's segment does not overlap with the query range, return the identity element
    if (node.segmentDoesNotContains(startIndexInclusive, endIndexInclusive)) {
      return this.identity;
    }

    // If the current node's segment is completely within the query range, return its value
    if (node.segmentIsIn(startIndexInclusive, endIndexInclusive)) {
      return this.tree[node.nodeIndex]!
    }

    // Recursively query the left and right children and combine their results using the binary operator
    let leftQueryNode = this.queryNodeByRecursive(node.leftChildNode(), startIndexInclusive, endIndexInclusive);
    let rightQueryNode = this.queryNodeByRecursive(node.rightChildNode(), startIndexInclusive, endIndexInclusive);

    // Post-order combination: after querying the children, combine their results using the binary operator
    return this.operator(leftQueryNode!, rightQueryNode!)
  }

  /**
   * Queries the segment tree for the result of applying the binary operator over the range [startIndexInclusive, endIndexInclusive] using an iterative approach.
   * <br><br>
   * This is based on Bottom-Up Segment Tree Construction and Update, as described in the [CP-Algorithms article](https://cp-algorithms.com/data_structures/segment_tree.html#top-down-segment-tree-construction-and-update).
   * @param startIndexInclusive start index of the query range (inclusive)
   * @param endIndexInclusive end index of the query range (inclusive)
   * @private
   */
  private queryNodeByLoop(startIndexInclusive: number, endIndexInclusive: number): T {
    let leftNodeIndex = this.getSegmentNodeIndex(startIndexInclusive);
    let rightNodeIndex = this.getSegmentNodeIndex(endIndexInclusive);

    let result = this.identity;

    while (leftNodeIndex <= rightNodeIndex) {
      // If the left node is a right child, include its value and move to the next node
      if (this.isRootNodeIndex(leftNodeIndex) || this.isRightNodeIndex(leftNodeIndex)) {
        result = this.operator(result, this.getNodeValueOrIdentity(leftNodeIndex));
        leftNodeIndex++;
      }

      // If the right node is a left child, include its value and move to the previous node
      if (this.isLeftNodeIndex(rightNodeIndex)) {
        result = this.operator(result, this.getNodeValueOrIdentity(rightNodeIndex));
        rightNodeIndex--;
      }

      // Move up to the parent nodes
      leftNodeIndex = SegmentNode.parentNodeIndex(leftNodeIndex);
      rightNodeIndex = SegmentNode.parentNodeIndex(rightNodeIndex);
    }

    return result;
  }

  private getNodeValue(nodeIndex: number): T | null | undefined{
    return this.tree[nodeIndex];
  }

  private getNodeValueOrIdentity(nodeIndex: number): T {
    return this.getNodeValue(nodeIndex) ?? this.identity;
  }

  private rootSegmentNode(): SegmentNode {
    return new SegmentNode(SegmentTree.BASE_INDEX, 0, this.baseNodeIndex)
  }

  private getSegmentNodeIndex(index: number): number {
    return this.baseNodeIndex + index;
  }

  private isRootNodeIndex(nodeIndex: number): boolean {
    return nodeIndex === SegmentTree.BASE_INDEX;
  }

  private isLeftNodeIndex(nodeIndex: number): boolean {
    if (this.isRootNodeIndex(nodeIndex)) {
      return false;
    }

    if (SegmentTree.BASE_INDEX % 2 == 0) {
      return nodeIndex % 2 == 1;
    }

    return nodeIndex % 2 == 0;
  }

  private isRightNodeIndex(nodeIndex: number): boolean {
    if (this.isRootNodeIndex(nodeIndex)) {
      return false;
    }

    return !this.isLeftNodeIndex(nodeIndex);
  }
}

class SegmentNode {
  nodeIndex: number;
  nodeLeft: number;
  nodeRight: number;

  constructor(nodeIndex: number, nodeLeft: number, nodeRight: number) {
    this.nodeIndex = nodeIndex;
    this.nodeLeft = nodeLeft;
    this.nodeRight = nodeRight;
  }

  leftChildNode(): SegmentNode {
    return new SegmentNode(
        SegmentNode.leftChildNodeIndex(this.nodeIndex),
        this.nodeLeft,
        Math.floor((this.nodeLeft + this.nodeRight) / 2)
    );
  }

  rightChildNode(): SegmentNode {
    return new SegmentNode(
        SegmentNode.rightChildNodeIndex(this.nodeIndex),
        Math.floor((this.nodeLeft + this.nodeRight) / 2) + 1,
        this.nodeRight
    );
  }

  isSegmentLeafNode(): boolean {
    return this.nodeLeft === this.nodeRight
  }

  contains(index: number): boolean {
    return this.nodeLeft <= index && index <= this.nodeRight;
  }

  doesNotContains(index: number): boolean {
    return !this.contains(index);
  }

  segmentDoesNotContains(startIndexInclusive: number, endIndexInclusive: number): boolean {
    return endIndexInclusive < this.nodeLeft || this.nodeRight < startIndexInclusive
  }

  segmentIsIn(startIndexInclusive: number, endIndexInclusive: number): boolean {
    return startIndexInclusive <= this.nodeLeft && this.nodeRight <= endIndexInclusive;
  }

  static parentNodeIndex(nodeIndex: number): number {
    return Math.floor((nodeIndex - 1) / 2);
  }

  static leftChildNodeIndex(nodeIndex: number): number {
    return nodeIndex * 2 + 1;
  }

  static rightChildNodeIndex(nodeIndex: number): number {
    return nodeIndex * 2 + 2;
  }
}