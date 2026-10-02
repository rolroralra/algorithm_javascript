import { describe, expect, it } from 'vitest';
import { eratosthenesSieve, isPrime } from '@/eratosthenes/eratosthenesSieve';

function naivePrimes(maxNumber: number): number[] {
  const result: number[] = [];
  for (let n = 2; n <= maxNumber; n += 1) {
    let prime = true;
    for (let i = 2; i * i <= n; i += 1) {
      if (n % i === 0) {
        prime = false;
        break;
      }
    }
    if (prime) result.push(n);
  }
  return result;
}

describe('eratosthenesSieve', () => {
  it('has no primes below two', () => {
    expect(eratosthenesSieve(1)).toEqual([]);
  });

  it('finds the smallest prime', () => {
    expect(eratosthenesSieve(2)).toEqual([2]);
  });

  it('finds primes up to ten', () => {
    expect(eratosthenesSieve(10)).toEqual([2, 3, 5, 7]);
  });

  it.each([30, 50, 100, 200])('matches a naive primality check up to %i', (maxNumber) => {
    expect(eratosthenesSieve(maxNumber)).toEqual(naivePrimes(maxNumber));
  });
});

describe('isPrime', () => {
  it.each([0, 1])('numbers below two are not prime (%i)', (number) => {
    expect(isPrime(number)).toBe(false);
  });

  it.each([2, 3, 5, 7, 11, 97])('recognizes known primes (%i)', (number) => {
    expect(isPrime(number)).toBe(true);
  });

  it.each([4, 6, 8, 9, 15, 100])('recognizes known composites (%i)', (number) => {
    expect(isPrime(number)).toBe(false);
  });

  it.each(Array.from({ length: 198 }, (_, i) => i + 2))(
    'matches the sieve for the range (%i)',
    (number) => {
      expect(isPrime(number)).toBe(eratosthenesSieve(200).includes(number));
    },
  );
});
