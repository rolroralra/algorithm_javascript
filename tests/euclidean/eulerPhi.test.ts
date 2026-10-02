import { describe, expect, it } from 'vitest';
import { EulerPhi } from '@/euclidean/eulerPhi';

describe('EulerPhi.compute (sieve)', () => {
  it('matches a known value', () => {
    const phi = new EulerPhi();
    expect(phi.compute(45)).toBe(24);
  });

  it('phi of one is one', () => {
    expect(new EulerPhi().compute(1)).toBe(1);
  });

  it('phi of a prime is the prime minus one', () => {
    expect(new EulerPhi().compute(17)).toBe(16);
  });

  it('phi of two', () => {
    expect(new EulerPhi().compute(2)).toBe(1);
  });

  it('reinitializes when queried beyond the current range', () => {
    const phi = new EulerPhi();
    phi.compute(6);

    expect(phi.compute(45)).toBe(24);
  });
});

describe('EulerPhi.phiByFactorization', () => {
  it('matches a known value', () => {
    expect(new EulerPhi().phiByFactorization(45)).toBe(24);
  });

  it('phi of one is one', () => {
    expect(new EulerPhi().phiByFactorization(1)).toBe(1);
  });

  it('phi of a prime is the prime minus one', () => {
    expect(new EulerPhi().phiByFactorization(17)).toBe(16);
  });

  it.each(Array.from({ length: 98 }, (_, i) => i + 2))(
    'matches the sieve-based computation (n=%i)',
    (n) => {
      expect(new EulerPhi().phiByFactorization(n)).toBe(new EulerPhi().compute(n));
    },
  );
});
