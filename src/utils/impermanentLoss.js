// utils/impermanentLoss.js

/**
 * Uniswap v3 impermanent loss calculation for a single range position
 * @param {number} P0 - initial price (token0 per token1) at deposit
 * @param {number} P1 - current/final price (token0 per token1)
 * @param {number} minPrice - lower range
 * @param {number} maxPrice - upper range
 * @param {number} totalInvestment - normalized initial value (default: 1000)
 * @returns {object}
 */
export function calculateUniswapV3IL(P0, P1, minPrice, maxPrice, totalInvestment = 1000) {
  // Defensive
  if (minPrice >= maxPrice || P0 <= 0 || P1 <= 0 || minPrice <= 0 || maxPrice <= 0) {
    return { ilPercent: 0, holdValue: 0, poolValue: 0, price: P1, amount0: 0, amount1: 0, lpAmount0: 0, lpAmount1: 0, L: 0 };
  }
  const sqrtP0 = Math.sqrt(P0), sqrtP1 = Math.sqrt(P1);
  const sqrtMin = Math.sqrt(minPrice), sqrtMax = Math.sqrt(maxPrice);

  let amount0 = 0, amount1 = 0, L = 0;

  if (P0 <= minPrice) {
    // All token0
    amount0 = totalInvestment / P0;
    amount1 = 0;
    L = amount0 / (1 / sqrtMin - 1 / sqrtMax);
  } else if (P0 >= maxPrice) {
    // All token1
    amount0 = 0;
    amount1 = totalInvestment;
    L = amount1 / (sqrtMax - sqrtMin);
  } else {
    // Mix of both
    const denom0 = 1 / sqrtP0 - 1 / sqrtMax;
    const denom1 = sqrtP0 - sqrtMin;
    // Proportional split to match full utilization for initial price in range
    amount0 = totalInvestment / (1 + P0) / P0;
    amount1 = totalInvestment - (amount0 * P0);
    L = amount0 / denom0; // Should match amount1 / denom1
  }

  let lpAmount0 = 0, lpAmount1 = 0;
  if (P1 <= minPrice) {
    lpAmount0 = L * (1 / sqrtMin - 1 / sqrtMax);
    lpAmount1 = 0;
  } else if (P1 >= maxPrice) {
    lpAmount0 = 0;
    lpAmount1 = L * (sqrtMax - sqrtMin);
  } else {
    lpAmount0 = L * (1 / sqrtP1 - 1 / sqrtMax);
    lpAmount1 = L * (sqrtP1 - sqrtMin);
  }

  const holdValue = amount0 * P1 + amount1;
  const poolValue = lpAmount0 * P1 + lpAmount1;
  const ilPercent = holdValue === 0 ? 0 : ((holdValue - poolValue) / holdValue) * 100;

  return {
    ilPercent,
    holdValue,
    poolValue,
    price: P1,
    amount0, amount1, lpAmount0, lpAmount1, L
  };
}

/**
 * Generate IL curve for Uniswap v3, sampling price from minPrice*0.5 to maxPrice*2
 */
export function generateV3ILCurveData(P0, minPrice, maxPrice, totalInvestment = 1000, numPoints = 80) {
  const startPrice = minPrice * 0.5;
  const endPrice = maxPrice * 2;
  const data = [];
  for (let i = 0; i <= numPoints; i++) {
    const P = startPrice * Math.pow(endPrice / startPrice, i / numPoints); // log-spaced for good visualization
    const { ilPercent } = calculateUniswapV3IL(P0, P, minPrice, maxPrice, totalInvestment);
    data.push({ price: P, ilPercent });
  }
  return data;
}
