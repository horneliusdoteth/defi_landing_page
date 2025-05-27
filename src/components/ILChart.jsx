// ILChart.jsx
import React from "react";
import {
	LineChart,
	Line,
	Area,
	XAxis,
	YAxis,
	ReferenceLine,
	ReferenceDot,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Label,
} from "recharts";
import { scaleLog } from "d3-scale";

export default function ILChart({
	data,
	currentPrice,
	minPrice,
	maxPrice,
	initialPrice,
	height = 340,
	xDomain,
	tokenA,
	tokenB,
}) {
	const safeData = Array.isArray(data) ? data : [];
	const prices = safeData.map((d) => d.price);
	const domain = xDomain || [Math.min(...prices), Math.max(...prices)];

	const yMax = Math.ceil(Math.max(...safeData.map((d) => d.ilPercent)) / 10) * 10 + 2;

	// Find the IL value for the current price (for marker)
	const marker = safeData.length
		? safeData.reduce(
				(closest, d) =>
					Math.abs(d.price - currentPrice) < Math.abs(closest.price - currentPrice) ? d : closest,
				safeData[0]
			)
		: null;

	// Choose how many ticks you want, e.g., 8
	const desiredNumTicks = 10;

	// Always include min and max
	const minTick = minPrice * 0.5;
	const maxTick = maxPrice * 2;

	let ticks = [];
	if (minTick > 0 && maxTick > minTick) {
		const logMin = Math.log(minTick);
		const logMax = Math.log(maxTick);

		for (let i = 0; i < desiredNumTicks; i++) {
			const ratio = i / (desiredNumTicks - 1);
			const tickValue = Math.exp(logMin + (logMax - logMin) * ratio);
			ticks.push(Number(tickValue.toFixed(0))); // round for label clarity
		}
	}

	// Compute the amounts you'd have if you just held at initial price
	const halfDeposit =
		data && data.length
			? data[0].amount0 !== undefined
				? { amount0: data[0].amount0, amount1: data[0].amount1 }
				: {
						amount0:
							(0.5 * (typeof data[0].poolValue === "number" ? data[0].poolValue : 1000)) /
							initialPrice,
						amount1: 0.5 * (typeof data[0].poolValue === "number" ? data[0].poolValue : 1000),
					}
			: { amount0: (0.5 * 1000) / initialPrice, amount1: 0.5 * 1000 };

	// These two points define the "just hold" line
	// const holdLine = [
	//   { price: minTick, holdValue: halfDeposit.amount0 * minTick + halfDeposit.amount1 },
	//   { price: maxTick, holdValue: halfDeposit.amount0 * maxTick + halfDeposit.amount1 }
	// ];

	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart data={safeData} margin={{ top: 30, right: 24, left: 0, bottom: 32 }}>
				<defs>
					<linearGradient id="il-gradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#00adf5" stopOpacity={0.35} />
						<stop offset="100%" stopColor="#00adf5" stopOpacity={0.05} />
					</linearGradient>
				</defs>
				<CartesianGrid stroke="#42536e" strokeDasharray="4 4" opacity={0.3} />
				<XAxis
					dataKey="price"
					type="number"
					scale="linear"
					domain={[minTick, maxTick]}
					stroke="#f1efe4"
					fontSize={14}
					tickFormatter={(value) => Math.round(value)}
					ticks={ticks}
				>
					<Label value="Price" position="bottom" fill="#f1efe4" fontSize={16} dy={16} />
				</XAxis>

				<YAxis
					yAxisId="il"
					dataKey="ilPercent"
					tickFormatter={(v) => `${v.toFixed(1)}%`}
					domain={[0, yMax]}
					stroke="#f1efe4"
					fontSize={14}
					width={60}
				>
					<Label
						value="Impermanent Loss (%)"
						angle={-90}
						fill="#f1efe4"
						position="left"
						fontSize={16}
						dx={-24}
					/>
				</YAxis>
				<YAxis
					yAxisId="values"
					orientation="right"
					stroke="#ffe900"
					fontSize={13}
					width={60}
					tickFormatter={(v) => `$${v.toFixed(0)}`}
				>
					<Label
						value="LP Value Breakdown"
						angle={90}
						fill="#ffe900"
						position="right"
						fontSize={14}
						dy={-20}
					/>
				</YAxis>
				<Area
					yAxisId="values"
					dataKey="valueA"
					stackId="1"
					stroke="#00adf5"
					fill="#00adf5"
					fillOpacity={0.18}
					name={tokenA}
					isAnimationActive={false}
				/>
				<Area
					yAxisId="values"
					dataKey="valueB"
					stackId="1"
					stroke="#ffe900"
					fill="#ffe900"
					fillOpacity={0.18}
					name={tokenB}
					isAnimationActive={false}
				/>
				<Line
					yAxisId="il"
					type="monotone"
					dataKey="ilPercent"
					stroke="#00adf5"
					strokeWidth={3}
					dot={false}
					isAnimationActive={true}
					name="IL %"
				/>
				<Line
					yAxisId="values"
					type="monotone"
					dataKey="holdValue"
					stroke="#ffffff"
					strokeWidth={2}
					dot={false}
					strokeDasharray="7 7"
					isAnimationActive={false}
					name="Hold Value"
				/>

				{/* --- FIXED: Explicit yAxisId for reference lines --- */}
				<ReferenceLine
					x={minPrice}
					yAxisId="il"
					stroke="#ffae42"
					strokeDasharray="2 2"
					label={{ value: "Min Price", fill: "#ffae42", fontSize: 13, dy: -10 }}
				/>
				<ReferenceLine
					x={maxPrice}
					yAxisId="il"
					stroke="#ffae42"
					strokeDasharray="2 2"
					label={{ value: "Max Price", fill: "#ffae42", fontSize: 13, dy: -10 }}
				/>
				<ReferenceLine
					x={initialPrice}
					yAxisId="il"
					stroke="#fff"
					strokeDasharray="4 4"
					label={{ value: "Initial Price", fill: "#fff", fontSize: 13, dy: -10 }}
				/>
				{marker && marker.ilPercent != null && marker.price != null && (
					<ReferenceDot
						x={marker.price}
						y={marker.ilPercent}
						yAxisId="il"
						r={9}
						fill="#0085e9"
						stroke="#fff"
						strokeWidth={3}
						isFront
						label={{
							position: "top",
							value: `IL: ${marker.ilPercent.toFixed(2)}% @ ${marker.price.toFixed(2)}`,
							fontSize: 14,
							fill: "#00adf5",
							dy: -18,
							fontWeight: "bold",
						}}
					/>
				)}

				<Tooltip
					content={({ active, payload, label }) => {
						if (!active || !payload || !payload.length) return null;
						const d = payload[0].payload;
						// Helper to safely format numbers
						const safe = (v, n = 2) =>
							v !== undefined && v !== null && !isNaN(v) ? v.toFixed(n) : "0.00";

						return (
							<div className="bg-blue-mid text-off-white p-2 rounded shadow text-xs">
								<div>
									Price: <b>{safe(d.price, 4)}</b>
								</div>
								<div>
									IL: <b>{safe(d.ilPercent, 2)}%</b>
								</div>
								<div>
									{tokenA} Value: <b>${safe(d.valueA)}</b>
								</div>
								<div>
									{tokenB} Value: <b>${safe(d.valueB)}</b>
								</div>
								<div>
									Hold Value: <b>${safe(d.holdValue)}</b>
								</div>
								<div>
									LP Value: <b>${safe(d.poolValue)}</b>
								</div>
								<div>
									<span>
										P&L vs Initial:{" "}
										<b className={d.pnlFromInitial >= 0 ? "text-green-400" : "text-red-400"}>
											{d.pnlFromInitial >= 0 ? "+" : ""}${safe(d.pnlFromInitial)}
										</b>
									</span>
								</div>
								<div>
									<span>
										P&L vs Holding:{" "}
										<b className={d.pnlFromHold >= 0 ? "text-green-400" : "text-red-400"}>
											{d.pnlFromHold >= 0 ? "+" : ""}${safe(d.pnlFromHold)}
										</b>
									</span>
								</div>
								<div>
									Split:{" "}
									<b>
										{safe(d.percentA, 2)}% {tokenA} / {safe(d.percentB, 2)}% {tokenB}
									</b>
								</div>
							</div>
						);
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
