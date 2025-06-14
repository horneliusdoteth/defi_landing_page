// utils/impermanentLoss.js

const FULL_RANGE_MIN = 1e-9;
const FULL_RANGE_MAX = 1e9;

/**
 * Uniswap v3 impermanent loss calculation for a single range position
 * @param {number} P0 - initial price (token0 per token1) at deposit
 * @param {number} P1 - current/final price (token0 per token1)
 * @param {number} minPrice - lower range
 * @param {number} maxPrice - upper range
 * @param {number} totalInvestment - normalized initial value (default: 1000)
 * @returns {object}
 */
// export function calculateUniswapV3IL(P0, P1, minPrice, maxPrice, totalInvestment = 1000) {
//   if (P1 <= 0) {
//   return {
//     ilPercent: 0,
//     holdValue: 0,
//     poolValue: 0,
//     price: P1,
//     amount0: 0,
//     amount1: 0,
//     lpAmount0: 0,
//     lpAmount1: 0,
//     valueA: 0,
//     valueB: 0,
//     percentA: 0,
//     percentB: 0,
//     L: 0,
//   };
// }
export function calculateUniswapV3IL(P0, P1, minPrice, maxPrice, totalInvestment = 1000) {
  /* ──────────────────────────────────────────────────────────
   *  PRICE   ≤ 0   ▸  token‑0 is worthless, pool value → 0
   * ────────────────────────────────────────────────────────── */
  if (P1 <= 0) {
    const amount0 = totalInvestment / 2 / P0;   // what you *would* have held
    const amount1 = totalInvestment / 2;

    const holdValue   = amount1;                // only token‑1 retains value
    const poolValue   = 0;                      // all LP held in worthless token‑0
    const ilPercent   = holdValue === 0 ? 0 : 100;

    return {
      ilPercent,
      holdValue,
      poolValue,
      price: P1,

      /* still expose the original deposit split for completeness */
      amount0: +amount0.toFixed(8),
      amount1: +amount1.toFixed(8),

      /* pool has 0 value, treat balances as 0            */
      lpAmount0: 0,
      lpAmount1: 0,
      valueA:    0,
      valueB:    0,
      percentA:  0,
      percentB:  0,
      L:         0,
    };
  }

if (
  !isFinite(P0) ||
  !isFinite(P1) ||
  !isFinite(minPrice) ||
  !isFinite(maxPrice) ||
  minPrice >= maxPrice ||
  P0 <= 0 ||
  minPrice <= 0 ||
  maxPrice <= 0
) {
  return {
    ilPercent: 0,
    holdValue: 0,
    poolValue: 0,
    price: P1,
    amount0: 0,
    amount1: 0,
    lpAmount0: 0,
    lpAmount1: 0,
    valueA: 0,
    valueB: 0,
    percentA: 0,
    percentB: 0,
    L: 0,
  };
}


  const isFullRange =
    (minPrice <= FULL_RANGE_MIN && maxPrice >= FULL_RANGE_MAX) ||
    (!isFinite(minPrice) && !isFinite(maxPrice));

  const sqrt = Math.sqrt;
  const sqrtP0 = sqrt(P0),
    sqrtP1 = sqrt(P1);
  const sqrtMin = sqrt(minPrice),
    sqrtMax = sqrt(maxPrice);

  let amount0, amount1, L;

  if (isFullRange) {
    amount0 = totalInvestment / 2 / P0;
    amount1 = totalInvestment / 2;
    L = Math.sqrt(amount0 * amount1);
  } else if (P0 <= minPrice + 1e-10) {
    amount0 = totalInvestment / P0;
    amount1 = 0;
    L = amount0 / (1 / sqrtMin - 1 / sqrtMax);
  } else if (P0 >= maxPrice - 1e-10) {
    amount0 = 0;
    amount1 = totalInvestment;
    L = amount1 / (sqrtMax - sqrtMin);
  } else {
    const numerator = totalInvestment;
    const denominator = P0 * (1 / sqrtP0 - 1 / sqrtMax) + (sqrtP0 - sqrtMin);
    L = numerator / denominator;
    amount0 = L * (1 / sqrtP0 - 1 / sqrtMax);
    amount1 = L * (sqrtP0 - sqrtMin);
  }

  let lpAmount0, lpAmount1;
  if (isFullRange) {
    const sqrtK = Math.sqrt(amount0 * amount1);
    lpAmount0 = sqrtK / sqrtP1;
    lpAmount1 = sqrtK * sqrtP1;
  } else if (P1 <= minPrice + 1e-10) {
    lpAmount0 = L * (1 / sqrtMin - 1 / sqrtMax);
    lpAmount1 = 0;
  } else if (P1 >= maxPrice - 1e-10) {
    lpAmount0 = 0;
    lpAmount1 = L * (sqrtMax - sqrtMin);
  } else {
    lpAmount0 = L * (1 / sqrtP1 - 1 / sqrtMax);
    lpAmount1 = L * (sqrtP1 - sqrtMin);
  }

  const holdValue = amount0 * P1 + amount1;
  const poolValue = lpAmount0 * P1 + lpAmount1;
  const ilPercent = holdValue === 0 ? 0 : ((holdValue - poolValue) / holdValue) * 100;

  // For chart: USD value of A (token0), B (token1), percent split
  const valueA = lpAmount0 * P1;
  const valueB = lpAmount1;
  const percentA = poolValue === 0 ? 0 : (valueA / poolValue) * 100;
  const percentB = poolValue === 0 ? 0 : (valueB / poolValue) * 100;

  return {
    ilPercent: +ilPercent.toFixed(8),
    holdValue: +holdValue.toFixed(8),
    poolValue: +poolValue.toFixed(8),
    price: P1,
    amount0: +amount0.toFixed(8),
    amount1: +amount1.toFixed(8),
    lpAmount0: +lpAmount0.toFixed(8),
    lpAmount1: +lpAmount1.toFixed(8),
    valueA: +valueA.toFixed(8),
    valueB: +valueB.toFixed(8),
    percentA: +percentA.toFixed(4),
    percentB: +percentB.toFixed(4),
    L: +L.toFixed(8)
  };
}

// utils/impermanentLoss.js

export function generateV3ILCurveData(
  P0,
  minPrice,
  maxPrice,
  totalInvestment = 1000,
  numPoints = 1000
) {
  // const startPrice = Math.max(minPrice * 0.5, 1e-8);
  /* ----------------------------------------------------------
   * 0‑PRICE ANCHOR  ▸  we push an extra entry at P = 0
   * --------------------------------------------------------*/
  // const initialAmount0 = totalInvestment / 2 / P0;
  // const initialAmount1 = totalInvestment / 2;     // hold‑strategy token‑1

  // const data = [
  //   {
  //     price: 0,
  //     /* pool is worthless at P=0 */
  //     ilPercent: 0,
  //     poolValue: 0,
  //     valueA: 0,
  //     valueB: 0,
  //     percentA: 0,
  //     percentB: 0,

  //     /* what if you had just HODLed?  token‑0 is worthless, token‑1 keeps half value */
  //     holdValue: initialAmount1,
  //     pnlFromInitial: -totalInvestment / 2,          // lost the token‑0 half
  //     pnlFromHold: -initialAmount1,                  // pool (0) – hold (½ V)
  //   },
  // ];
/* ----------------------------------------------------------
 * 0‑PRICE ANCHOR  ▸  ask the helper for the true values
 * --------------------------------------------------------*/
const point0 = calculateUniswapV3IL(P0, 0, minPrice, maxPrice, totalInvestment);

const data = [
  {
    price: 0,
    ilPercent:       point0.ilPercent,           // 100 %
    valueA:          point0.valueA,
    valueB:          point0.valueB,
    percentA:        point0.percentA,
    percentB:        point0.percentB,
    poolValue:       point0.poolValue,           // 0
    holdValue:       point0.holdValue,           // ½ deposit
    pnlFromInitial:  point0.poolValue - totalInvestment,   // –deposit
    pnlFromHold:     point0.poolValue - point0.holdValue,  // –½ deposit
  },
];

/*  Holding amounts used for linear “HODL” line everywhere below  */
const initialAmount0 = totalInvestment / 2 / P0;
const initialAmount1 = totalInvestment / 2;
 
  /* ---------- generate the usual log‑spaced points (>0) ---------- */
  const startPrice = Math.max(minPrice * 0.5, 1e-8);
  const endPrice = maxPrice * 2;
  const logStart = Math.log(startPrice);
  const logEnd = Math.log(endPrice);

  // 1. Calculate initial holding amounts (if you held, not LPed)
  // const initialAmount0 = totalInvestment / 2 / P0; 
  // const initialAmount1 = totalInvestment / 2;      

  // const data = [];

  for (let i = 0; i <= numPoints; i++) {
    const logP = logStart + (logEnd - logStart) * (i / numPoints);
    const P = Math.exp(logP);
    const point = calculateUniswapV3IL(P0, P, minPrice, maxPrice, totalInvestment);
    // const show = P >= startPrice;
    // *** Here's the linear hold calculation ***
    const linearHoldValue = initialAmount0 * P + initialAmount1;
    data.push({
      price: +P.toFixed(8),
      ilPercent:  point.ilPercent,
      valueA:     point.valueA,
      valueB:     point.valueB,
      percentA:   point.percentA,
      percentB:   point.percentB,
      poolValue:  point.poolValue,
      pnlFromInitial: point.poolValue - totalInvestment,
      pnlFromHold:    point.poolValue - linearHoldValue,
      holdValue: linearHoldValue, // *** Always use the linear calculation ***
    });
  }

  // Ensure minPrice and maxPrice are included in the data
  [minPrice, maxPrice].forEach((bound) => {
    if (!data.some((d) => Math.abs(d.price - bound) < 1e-8)) {
      const point = calculateUniswapV3IL(P0, bound, minPrice, maxPrice, totalInvestment);
      const linearHoldValue = initialAmount0 * bound + initialAmount1;
      data.push({
        price: +bound.toFixed(8),
        ilPercent: point.ilPercent,
        valueA: point.valueA,
        valueB: point.valueB,
        percentA: point.percentA,
        percentB: point.percentB,
        poolValue: point.poolValue,
        pnlFromInitial: point.poolValue - totalInvestment,
        pnlFromHold: point.poolValue - linearHoldValue,
        holdValue: linearHoldValue, // linear calculation at bounds
      });
    }
  });

  data.sort((a, b) => a.price - b.price);
  return data;
}



