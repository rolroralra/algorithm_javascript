import { notImplemented } from '../shared/notImplemented';

/**
 * value/left/right만 갖는 얕은 공통 노드 베이스.
 * parent(BST), height(AVL), color(Red-Black) 같은 트리별 확장은 각 서브클래스가 추가한다.
 */
export class BinaryTreeNode<T> {
  value: T;
  left: BinaryTreeNode<T> | null = null;
  right: BinaryTreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class BinaryTree<T> {
  root: BinaryTreeNode<T> | null;

  constructor(root: BinaryTreeNode<T> | null = null) {
    this.root = root;
  }

  inorder(): T[] {
    notImplemented('BinaryTree.inorder');
  }

  preorder(): T[] {
    notImplemented('BinaryTree.preorder');
  }

  postorder(): T[] {
    notImplemented('BinaryTree.postorder');
  }

  height(): number {
    notImplemented('BinaryTree.height');
  }

  printTree(): void {
    notImplemented('BinaryTree.printTree');
  }
}
