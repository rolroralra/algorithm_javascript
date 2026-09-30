import { notImplemented } from '../shared/notImplemented';

/**
 * Euler's totient function via a linear sieve over `phiValues`, memoized up to the
 * largest `n` queried so far. Call `compute(n)` to get `phi(n)` (mirrors Python's
 * `EulerPhi.__call__`, which makes instances directly callable).
 */
export class EulerPhi {
  private maxNumber: number | null = null;
  private phiValues: number[] | null = null;

  /** (Re)initializes the sieve up to `n`, discarding any previously memoized range. */
  init(n: number): void {
    notImplemented('EulerPhi.init');
  }

  /** Returns phi(n), (re)initializing the sieve first if `n` is outside the memoized range. */
  compute(n: number): number {
    notImplemented('EulerPhi.compute');
  }

  /** Computes phi(n) directly via prime factorization, without the sieve. */
  phiByFactorization(n: number): number {
    notImplemented('EulerPhi.phiByFactorization');
  }
}
