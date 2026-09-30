import { notImplemented } from '../shared/notImplemented';

/**
 * Knapsack problem dispatcher.
 *
 * @param oneOrZero when true, each item may be taken at most once (0/1 knapsack);
 *   when false, items are available in unlimited supply (unbounded knapsack)
 * @throws Error if `weights.length !== values.length` or `maxWeight < 0`
 */
export function knapsack(
  weights: number[],
  values: number[],
  maxWeight: number,
  oneOrZero = false,
): number {
  notImplemented('knapsack');
}

/** Unbounded knapsack: each item may be taken any number of times. */
export function knapsackWithSufficientStock(
  weights: number[],
  values: number[],
  maxWeight: number,
): number {
  notImplemented('knapsackWithSufficientStock');
}

/** 0/1 knapsack: each item may be taken at most once. */
export function knapsackWithOneOrZero(
  weights: number[],
  values: number[],
  maxWeight: number,
): number {
  notImplemented('knapsackWithOneOrZero');
}
