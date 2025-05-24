//GradientHero.jsx
import React from "react";

export default function GradientHero({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Gradient layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // Responsive: different ellipse on mobile vs desktop
          background:
            "radial-gradient(ellipse at 70% 30%, #0085e9 0%, #00adf5 50%, #000a17 100%)",
        }}
      />
      {/* Optional: add a semi-transparent overlay for more contrast */}
      <div className="absolute inset-0 bg-bg-dark opacity-60 pointer-events-none" />
      {/* Content goes on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
