// ZoomableChart.jsx
import React, { useRef, useState, useEffect } from "react";

/**
 * Generic wrapper that adds zoom + pan to any Recharts chart.
 * ↳ It only manipulates the `xDomain` prop you pass to the child.
 *
 * Props
 * ────────────────────────────────────────────────────────────
 *  data          full data array (needed for auto‑reset)
 *  children      a function that receives (xDomain) and returns the chart JSX
 *  minX, maxX    convenience overrides; otherwise derived from data
 *  zoomFactor    wheel zoom multiplier (default 0.8 → 20 % per wheel‑step)
 */
export default function ZoomableChart({ data, children, minX, maxX, zoomFactor = 0.8 }) {
	const containerRef = useRef(null);

	/* initial domain = whole data set (or caller override) */
	const [domain, setDomain] = useState([
		minX ?? Math.min(...data.map((d) => d.price)),
		maxX ?? Math.max(...data.map((d) => d.price)),
	]);

	/* ---------- helpers ---------- */

	const clamp = (val, lo, hi) => Math.max(lo, Math.min(val, hi));

	const toDataX = (clientX) => {
		const { left, width } = containerRef.current.getBoundingClientRect();
		const ratio = (clientX - left) / width;
		return domain[0] + ratio * (domain[1] - domain[0]);
	};

	/* ---------- mouse‑wheel (zoom) ---------- */
	//   const handleWheel = useCallback(
	//     (e) => {
	//       e.preventDefault();
	//       if (!containerRef.current) return;

	//       const targetX = toDataX(e.clientX);
	//       const factor = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

	//       const newMin = targetX - (targetX - domain[0]) * factor;
	//       const newMax = targetX + (domain[1] - targetX) * factor;

	//       /* stop zooming out past original bounds */
	//       const fullMin = minX ?? Math.min(...data.map((d) => d.price));
	//       const fullMax = maxX ?? Math.max(...data.map((d) => d.price));

	//       setDomain([
	//         clamp(newMin, fullMin, fullMax),
	//         clamp(newMax, fullMin, fullMax),
	//       ]);
	//     },
	//     [domain, data, zoomFactor, minX, maxX]
	//   );
	/* ---------- mouse‑wheel (zoom)  (native, non‑passive) ---------- */
	useEffect(() => {
		const node = containerRef.current;
		if (!node) return;

		const wheelListener = (e) => {
			// Ctrl+wheel (browser zoom) → let the browser handle it.
			if (e.ctrlKey) return;

			e.preventDefault(); // stop page scroll
			e.stopPropagation();

			const targetX = toDataX(e.clientX);
			const factor = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

			const newMin = targetX - (targetX - domain[0]) * factor;
			const newMax = targetX + (domain[1] - targetX) * factor;

			const fullMin = minX ?? Math.min(...data.map((d) => d.price));
			const fullMax = maxX ?? Math.max(...data.map((d) => d.price));

			setDomain([clamp(newMin, fullMin, fullMax), clamp(newMax, fullMin, fullMax)]);
		};

		/* passive: false is **critical** */
		node.addEventListener("wheel", wheelListener, { passive: false });
		return () => node.removeEventListener("wheel", wheelListener);
	}, [domain, data, zoomFactor, minX, maxX]);
	/* ---------- drag (pan) ---------- */
	const drag = useRef(null);

	const onMouseDown = (e) => {
		drag.current = { startX: e.clientX, startDomain: [...domain] };
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	};

	const onMouseMove = (e) => {
		if (!drag.current) return;
		const { startX, startDomain } = drag.current;
		const { width } = containerRef.current.getBoundingClientRect();
		const dxPixels = e.clientX - startX;
		const dxData = (dxPixels / width) * (startDomain[1] - startDomain[0]);
		const fullMin = minX ?? Math.min(...data.map((d) => d.price));
		const fullMax = maxX ?? Math.max(...data.map((d) => d.price));
		setDomain([
			clamp(startDomain[0] - dxData, fullMin, fullMax),
			clamp(startDomain[1] - dxData, fullMin, fullMax),
		]);
	};

	const onMouseUp = () => {
		drag.current = null;
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
	};

	/* ---------- double‑click (reset) ---------- */
	const handleDoubleClick = () => {
		setDomain([
			minX ?? Math.min(...data.map((d) => d.price)),
			maxX ?? Math.max(...data.map((d) => d.price)),
		]);
	};

	/* ---------- render ---------- */
	return (
		<div
			ref={containerRef}
			style={{ width: "100%", height: "100%" }}
			// onWheel={handleWheel}
			onMouseDown={onMouseDown}
			onDoubleClick={handleDoubleClick}
		>
			{children(domain)}
		</div>
	);
}
