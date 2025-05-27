// ImpermanentLossCalculator.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { calculateUniswapV3IL, generateV3ILCurveData } from "../utils/impermanentLoss";
import * as htmlToImage from "html-to-image";
import ILChart from "./ILChart";

function NumberInput({ label, value, onChange, min = 0.01, step = 0.01, ...props }) {
	return (
		<label className="flex flex-col mb-3">
			<span className="text-off-white text-xs mb-1">{label}</span>
			<input
				type="number"
				value={value}
				min={min}
				step={step}
				onChange={(e) => onChange(Number(e.target.value))}
				className="bg-bg-dark text-off-white border border-blue-mid rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-light transition"
				{...props}
			/>
		</label>
	);
}
function TextInput({ label, value, onChange, ...props }) {
	return (
		<label className="flex flex-col mb-3">
			<span className="text-off-white text-xs mb-1">{label}</span>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="bg-bg-dark text-off-white border border-blue-mid rounded px-2 py-1"
				{...props}
			/>
		</label>
	);
}

function InputPanel({
	vDeposit,
	setVDeposit,
	initialPrice,
	setInitialPrice,
	minPrice,
	setMinPrice,
	maxPrice,
	setMaxPrice,
	currentPrice,
	setCurrentPrice,
	tokenA,
	setTokenA,
	tokenB,
	setTokenB,
	onCopyLink,
	onExportImage,
	copied,
	className = "",
}) {
	return (
		<div
			className={`w-full md:w-2/5 flex-shrink-0 bg-bg-dark p-6 md:p-10 rounded-2xl shadow-2xl mb-6 md:mb-0 ${className}`}
		>
			<h2 className="text-xl md:text-2xl text-off-white font-semibold mb-6">Simulation Inputs</h2>
			<TextInput label="Base asset (Token A)" value={tokenA} onChange={setTokenA} />
			<TextInput label="Quote asset (Token B)" value={tokenB} onChange={setTokenB} />
			<NumberInput label="V deposit" value={vDeposit} onChange={setVDeposit} min={1} step={1} />
			<NumberInput
				label="P deposit (Initial Price, P₀)"
				value={initialPrice}
				onChange={setInitialPrice}
				min={0.0001}
				step={0.01}
			/>
			<div className="flex flex-col md:flex-row gap-3">
				<NumberInput
					label="P lower"
					value={minPrice}
					onChange={setMinPrice}
					min={0.0001}
					step={0.01}
				/>
				<NumberInput
					label="P upper"
					value={maxPrice}
					onChange={setMaxPrice}
					min={0.0001}
					step={0.01}
				/>
			</div>
			<label className="flex flex-col">
  <span className="text-off-white text-xs mb-1">
    Scenario Price (P now, moves the blue marker)
  </span>
  <div className="flex flex-row gap-2 items-center">
    <input
      type="range"
      min={Math.log(minPrice * 0.5)}
      max={Math.log(maxPrice * 2)}
      step={(Math.log(maxPrice * 2) - Math.log(minPrice * 0.5)) / 100}
      value={Math.log(currentPrice)}
      onChange={(e) => setCurrentPrice(Math.exp(Number(e.target.value)))}
      className="accent-blue-light h-2 w-full bg-blue-mid rounded-lg appearance-none"
      style={{ marginTop: "8px" }}
    />
    <input
      type="number"
      min={minPrice * 0.5}
      max={maxPrice * 2}
      step={0.0001}
      value={currentPrice}
      onChange={(e) => setCurrentPrice(Number(e.target.value))}
      className="w-24 bg-bg-dark text-blue-light border border-blue-mid rounded px-2 py-1 font-mono text-xs"
      aria-label="Manual scenario price input"
      style={{ marginTop: "8px" }}
    />
  </div>
  <span className="text-blue-light text-xs font-mono mt-2">{currentPrice.toFixed(4)}</span>
</label>

			<div className="flex mt-6 space-x-3">
				<button
					type="button"
					onClick={onCopyLink}
					className="bg-blue-light hover:bg-blue-mid text-bg-dark rounded-2xl px-4 py-2 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-light"
					aria-label="Copy shareable link"
				>
					{copied ? "Copied!" : "Copy Link"}
				</button>
				<button
					type="button"
					onClick={onExportImage}
					className="bg-blue-light hover:bg-blue-mid text-bg-dark rounded-2xl px-4 py-2 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-light"
					aria-label="Download chart image"
				>
					Download Image
				</button>
			</div>
			<div className="text-xs text-gray-400 mt-3">
				Share a scenario or export your chart for reports/social!
			</div>
		</div>
	);
}

function OutputPanel({
	ilPoint,
	chartData,
	chartRef,
	chartHeight,
	className = "",
	initialPrice,
	minPrice,
	maxPrice,
	currentPrice,
	vDeposit,
	tokenA,
	tokenB,
}) {
	const initialLP = calculateUniswapV3IL(initialPrice, initialPrice, minPrice, maxPrice, vDeposit);

	return (
		<div
			className={`w-full ${className} bg-bg-dark rounded-2xl shadow-2xl p-6 flex flex-col items-center`}
		>
			<div className="mb-6 w-full">
				<div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-off-white text-base">
					{/* summary values */}
          <div>
						<span className="font-semibold">Scenario Price</span>:{" "}
						<span className="text-blue-light text-lg font-mono font-bold">
							${Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
						</span>
					</div>
					<div>
						<span className="font-semibold">Impermanent Loss</span>:{" "}
						<span className="text-blue-light text-lg font-bold">
							{Math.abs(ilPoint.ilPercent).toFixed(2)}%
						</span>
					</div>
					<div>
						<span className="text-gray-300">Hold Value: </span>
						<span className="font-mono">${ilPoint.holdValue.toFixed(2)}</span>
					</div>
					<div>
						<span className="text-gray-300">V deposit (Initial): </span>
						<span className="font-mono">${vDeposit.toFixed(2)}</span>
					</div>
					<div>
						<span className="text-gray-300">P deposit (Initial LP Value): </span>
						<span className="font-mono">${initialLP.poolValue.toFixed(2)}</span>
					</div>
					<div>
						<span className="text-gray-300">Current LP Value: </span>
						<span className="font-mono">${ilPoint.poolValue.toFixed(2)}</span>
					</div>
					<div>
						<span className="text-gray-300">Difference: </span>
						<span className="font-mono">
							${Math.abs(ilPoint.holdValue - ilPoint.poolValue).toFixed(2)}
						</span>
					</div>
				</div>

				{/* --- P&L rows --- */}
				<div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-off-white text-base mt-1">
					<div>
						<span className="text-gray-300">P&L vs Initial: </span>
						<span className={ilPoint.poolValue - vDeposit >= 0 ? "text-green-400" : "text-red-400"}>
							{(ilPoint.poolValue - vDeposit >= 0 ? "+" : "") +
								(ilPoint.poolValue - vDeposit).toFixed(2)}
						</span>
					</div>
					<div>
						<span className="text-gray-300">P&L vs Holding: </span>
						<span
							className={
								ilPoint.poolValue - ilPoint.holdValue >= 0 ? "text-green-400" : "text-red-400"
							}
						>
							{(ilPoint.poolValue - ilPoint.holdValue >= 0 ? "+" : "") +
								(ilPoint.poolValue - ilPoint.holdValue).toFixed(2)}
						</span>
					</div>
				</div>
			</div>
			{/* Show breakdown of LP position */}
			<div className="flex flex-col gap-1 mb-2 text-off-white">
				<div>
					<span className="text-gray-300">{tokenA} (value): </span>
					<span className="font-mono">${(ilPoint.lpAmount0 * currentPrice).toFixed(2)}</span>
				</div>
				<div>
					<span className="text-gray-300">{tokenB} (value): </span>
					<span className="font-mono">${ilPoint.lpAmount1.toFixed(2)}</span>
				</div>

				<div>
					<span className="text-gray-300">Pool split: </span>
					<span className="font-mono">
						{ilPoint.percentA.toFixed(2)}% {tokenA} / {ilPoint.percentB.toFixed(2)}% {tokenB}
					</span>
				</div>
			</div>
			<div
				ref={chartRef}
				className="w-full bg-bg-dark p-3 rounded-2xl border border-blue-mid shadow-lg"
			>
				<ILChart
					data={chartData}
					currentPrice={currentPrice}
					minPrice={minPrice}
					maxPrice={maxPrice}
					initialPrice={initialPrice}
					height={chartHeight}
					tokenA={tokenA}
					tokenB={tokenB}
				/>
			</div>
			<div className="text-xs text-gray-400 mt-3 text-center max-w-lg">
				Chart shows impermanent loss % for various price scenarios. <br />
				Stacked area shows LP value breakdown by asset. <br />
				Vertical lines: initial price, min/max range.
				<br />
				<span className="text-blue-light font-semibold">Note:</span> Impermanent loss shown here
				does <b>not</b> include any trading fees earned by your LP position.
			</div>
		</div>
	);
}

export default function ImpermanentLossCalculator() {
	const [tokenA, setTokenA] = useState("Token A");
	const [tokenB, setTokenB] = useState("Token B");
	const [vDeposit, setVDeposit] = useState(1000);
	const [initialPrice, setInitialPrice] = useState(100);
	const [minPrice, setMinPrice] = useState(70);
	const [maxPrice, setMaxPrice] = useState(130);
	const [currentPrice, setCurrentPrice] = useState(100);
	const [copied, setCopied] = useState(false);
	const chartRef = useRef();

	const chartHeight = typeof window !== "undefined" && window.innerWidth >= 1280 ? 500 : 340;

	useEffect(() => {
		setCurrentPrice(initialPrice);
	}, [initialPrice, minPrice, maxPrice]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.has("initial")) setInitialPrice(Number(params.get("initial")));
		if (params.has("min")) setMinPrice(Number(params.get("min")));
		if (params.has("max")) setMaxPrice(Number(params.get("max")));
		if (params.has("current")) setCurrentPrice(Number(params.get("current")));
		if (params.has("vDeposit")) setVDeposit(Number(params.get("vDeposit")));
		if (params.has("tokenA")) setTokenA(params.get("tokenA"));
		if (params.has("tokenB")) setTokenB(params.get("tokenB"));
	}, []);

	useEffect(() => {
		const params = new URLSearchParams({
			initial: initialPrice,
			min: minPrice,
			max: maxPrice,
			current: currentPrice,
			vDeposit: vDeposit,
			tokenA: tokenA,
			tokenB: tokenB,
		});
		window.history.replaceState({}, "", `?${params.toString()}`);
	}, [initialPrice, minPrice, maxPrice, currentPrice, vDeposit, tokenA, tokenB]);

	const chartData = useMemo(
		() => generateV3ILCurveData(initialPrice, minPrice, maxPrice, vDeposit),
		[initialPrice, minPrice, maxPrice, vDeposit]
	);
	const ilPoint = useMemo(
		() => calculateUniswapV3IL(initialPrice, currentPrice, minPrice, maxPrice, vDeposit),
		[initialPrice, currentPrice, minPrice, maxPrice, vDeposit]
	);

	const handleCopyLink = async () => {
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		} catch {
			setCopied(false);
		}
	};

	const handleExportImage = async () => {
		if (!chartRef.current) return;
		htmlToImage.toPng(chartRef.current, { cacheBust: true }).then((dataUrl) => {
			const link = document.createElement("a");
			link.download = "impermanent_loss_chart.png";
			link.href = dataUrl;
			link.click();
		});
	};

	return (
		<div
			id="il-calculator"
			className="bg-bg-dark text-off-white rounded-2xl p-4 md:p-12 w-full max-w-screen-2xl mx-auto my-12 shadow-2xl"
		>
			<h1 className="text-2xl md:text-3xl font-extrabold text-blue-light mb-3">
				Uniswap v3 Impermanent Loss Calculator
			</h1>
			<p className="text-off-white text-base mb-8 max-w-xl">
				Simulate impermanent loss for concentrated liquidity in Uniswap v3 positions. Choose your
				base/quote asset names, set your deposit, price range, and scenario. Visualize how your
				liquidity, impermanent loss, and pool composition evolve as price changes.
			</p>
			<div className="flex flex-col md:flex-row items-start md:space-x-12">
				<InputPanel
					className="md:w-2/5"
					vDeposit={vDeposit}
					setVDeposit={setVDeposit}
					initialPrice={initialPrice}
					setInitialPrice={setInitialPrice}
					minPrice={minPrice}
					setMinPrice={setMinPrice}
					maxPrice={maxPrice}
					setMaxPrice={setMaxPrice}
					currentPrice={currentPrice}
					setCurrentPrice={setCurrentPrice}
					tokenA={tokenA}
					setTokenA={setTokenA}
					tokenB={tokenB}
					setTokenB={setTokenB}
					onCopyLink={handleCopyLink}
					onExportImage={handleExportImage}
					copied={copied}
				/>
				<OutputPanel
					className="md:w-3/5"
					ilPoint={ilPoint}
					chartData={chartData}
					chartRef={chartRef}
					chartHeight={chartHeight}
					initialPrice={initialPrice}
					minPrice={minPrice}
					maxPrice={maxPrice}
					currentPrice={currentPrice}
					vDeposit={vDeposit}
					tokenA={tokenA}
					tokenB={tokenB}
				/>
			</div>
		</div>
	);
}
