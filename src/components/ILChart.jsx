import React from "react";
import {
  LineChart, Line, Area, XAxis, YAxis, ReferenceLine, ReferenceDot,
  Tooltip, ResponsiveContainer, CartesianGrid, Label
} from "recharts";

export default function ILChart({
  data,
  currentPrice,
  minPrice,
  maxPrice,
  initialPrice,
  height = 340,
  xDomain,
}) {
  const safeData = Array.isArray(data) ? data : [];
  const prices = safeData.map(d => d.price);
  const domain = xDomain || [Math.min(...prices), Math.max(...prices)];
  const yMax = Math.ceil(Math.max(...safeData.map(d => d.ilPercent)) / 10) * 10 + 2;

  // Find the IL value for the current price (for marker)
  const marker = safeData.reduce((closest, d) =>
    Math.abs(d.price - currentPrice) < Math.abs(closest.price - currentPrice) ? d : closest, safeData[0]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={safeData} margin={{ top: 30, right: 24, left: 0, bottom: 32 }}>
        <defs>
          <linearGradient id="il-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00adf5" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#00adf5" stopOpacity={0.05} />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00adf5" floodOpacity="0.6" />
          </filter>
        </defs>
        <CartesianGrid stroke="#42536e" strokeDasharray="4 4" opacity={0.3} />
        <XAxis
          dataKey="price"
          type="number"
          domain={domain}
          stroke="#f1efe4"
          fontSize={14}
        >
          <Label value="Price" position="bottom" fill="#f1efe4" fontSize={16} dy={16} />
        </XAxis>
        <YAxis
          dataKey="ilPercent"
          tickFormatter={v => `${v.toFixed(1)}%`}
          domain={[0, yMax]}
          stroke="#f1efe4"
          fontSize={14}
          width={60}
        >
          <Label value="Impermanent Loss (%)" angle={-90} fill="#f1efe4" position="left" fontSize={16} dx={-24} />
        </YAxis>
        <Area type="monotone" dataKey="ilPercent" stroke="none" fill="url(#il-gradient)" isAnimationActive={false} />
        <Line type="monotone" dataKey="ilPercent" stroke="#00adf5" strokeWidth={3} dot={false} isAnimationActive={true} />
        <ReferenceLine
          x={initialPrice}
          stroke="#fff"
          strokeDasharray="4 4"
          ifOverflow="extendDomain"
          label={{ value: "Initial Price", fill: "#fff", fontSize: 13, dy: -10 }}
        />
        <ReferenceLine
          x={minPrice}
          stroke="#0085e9"
          strokeDasharray="4 2"
          ifOverflow="extendDomain"
          label={{ value: "Min Price", fill: "#0085e9", fontSize: 13, dy: -10 }}
        />
        <ReferenceLine
          x={maxPrice}
          stroke="#0085e9"
          strokeDasharray="4 2"
          ifOverflow="extendDomain"
          label={{ value: "Max Price", fill: "#0085e9", fontSize: 13, dy: -10 }}
        />
        {/* Marker for current scenario (price = currentPrice) */}
        <ReferenceDot
          x={marker.price}
          y={marker.ilPercent}
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
          filter="url(#shadow)"
        />
        <Tooltip
          content={({ active, payload }) => active && payload && payload.length ? (
            <div className="bg-blue-mid text-off-white p-2 rounded shadow text-xs">
              <div>Price: <b>{payload[0].payload.price.toFixed(4)}</b></div>
              <div>IL: <b>{payload[0].payload.ilPercent.toFixed(2)}%</b></div>
            </div>
          ) : null}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
