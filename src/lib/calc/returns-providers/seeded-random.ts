/**
 * Seeded random number generator for reproducible simulations
 * Uses a linear congruential generator (LCG) algorithm
 */
export class SeededRandom {
  private seed: number;

  /**
   * Creates a seeded random number generator
   * @param seed - Initial seed value for random number generation
   */
  constructor(seed: number) {
    // Ensure seed is a positive integer within valid range
    this.seed = Math.floor(Math.abs(seed)) % 2147483648; // 2^31
    if (this.seed === 0) this.seed = 1;
  }

  /**
   * Generate next random number in the interval [0, 1)
   * @returns Random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    // LCG parameters (same as glibc)
    const a = 1103515245;
    const c = 12345;
    const m = 2147483648; // 2^31

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Generate a random number from standard normal distribution (mean=0, std=1)
   * Uses Box-Muller transform
   * @returns Standard normal random variable (mean=0, std=1)
   */
  nextGaussian(): number {
    let u1;

    // Ensure u1 is not 0 to avoid log(0)
    do {
      u1 = this.next();
    } while (u1 === 0);

    const u2 = this.next();

    // Box-Muller transform
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0;
  }

  /**
   * Reset the generator with a new seed
   * @param seed - New seed value for random number generation
   */
  reset(seed: number): void {
    // Apply same validation as constructor
    this.seed = Math.floor(Math.abs(seed)) % 2147483648; // 2^31
    if (this.seed === 0) this.seed = 1;
  }
}
