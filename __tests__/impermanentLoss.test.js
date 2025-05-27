import { calculateUniswapV3IL } from '../src/utils/impermanentLoss';

describe('Uniswap V3 IL Calculation', () => {
  it('Full range behaves like 50/50 pool', () => {
    const result = calculateUniswapV3IL(100, 200, 1e-12, 1e12, 1000);
    expect(Math.abs(result.ilPercent - 5.72)).toBeLessThan(0.05);
  });

  it('Single-sided (token0) out of range, stays out, no IL', () => {
    const result = calculateUniswapV3IL(90, 80, 100, 200, 1000);
    expect(Math.abs(result.ilPercent)).toBeLessThan(1e-4);
  });

  it('Single-sided (token0), price crosses range', () => {
    const result = calculateUniswapV3IL(90, 150, 100, 200, 1000);
    expect(result.ilPercent).toBeGreaterThan(0);
  });

  it('Single-sided (token1), price falls into range', () => {
    const result = calculateUniswapV3IL(220, 150, 100, 200, 1000);
    expect(result.ilPercent).toBeGreaterThan(0);
  });

  it('In-range, stays in-range, small IL', () => {
    const result = calculateUniswapV3IL(150, 140, 100, 200, 1000);
    expect(result.ilPercent).toBeGreaterThan(0);
    expect(result.ilPercent).toBeLessThan(3);
  });

  it('In-range, price exits range, higher IL', () => {
    const result = calculateUniswapV3IL(150, 90, 100, 200, 1000);
    expect(result.ilPercent).toBeGreaterThan(10);
  });

  it('Handles zero/invalid inputs gracefully', () => {
    const result = calculateUniswapV3IL(0, 0, 0, 0, 1000);
    expect(result.ilPercent).toBe(0);
    expect(result.holdValue).toBe(0);
  });
});
