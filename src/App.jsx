// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccountMenu from "./components/AccountMenu";
import OfferPage from "./components/OfferPage";
import ImpermanentLossCalculator from "./components/ImpermanentLossCalculator";
import ToolsDashboard from "./components/ToolsDashboard";
import drippyLogo from "./assets/drippy_logo.png";
import { Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<div className="App relative min-h-screen w-full overflow-x-hidden">
			{/* Background as before */}
			<div
				className="fixed inset-0 -z-10"
				style={{
					background: `
            radial-gradient(ellipse 110% 100% at -20% -20%, #000a17 80%, transparent 100%),
            radial-gradient(ellipse 60% 40% at 92% 4%, #f1efe4 0%, #f1efe400 85%),
            radial-gradient(ellipse 70% 55% at 54% 80%, #0085e950 10%, #00adf560 60%, #000a1700 100%),
            radial-gradient(ellipse 50% 35% at 12% 96%, #00adf550 8%, #000a1700 100%),
            linear-gradient(120deg, #000a17 70%, #f1efe420 100%)
          `,
				}}
			/>
			{/* Top bar */}
			<div className="flex items-center justify-between w-full px-4 md:px-8 pt-4 z-50 absolute top-0 left-0">
				<div>
					<img
						src={drippyLogo}
						alt="Drippy Logo"
						className="h-24 md:h-32 w-auto object-contain rounded-3xl transition-transform hover:scale-105"
					/>
				</div>
				<div className="flex items-center space-x-4">
					<AccountMenu />
				</div>
			</div>

			{/* Main routed content */}
			<div className="pt-40">
				{" "}
				{/* Add padding-top so logo/menu don't overlap content */}
				<Routes>
					<Route path="/" element={<OfferPage />} />
					<Route path="/tools" element={<ToolsDashboard />} />
					<Route
						path="/tools/impermanent-loss"
						element={
							<ProtectedRoute>
								<ImpermanentLossCalculator />
							</ProtectedRoute>
						}
					/>
					{/* Add more tools as you build them: */}
					{/* <Route path="/tools/apy-calculator" element={<APYCalculator />} /> */}
					{/* <Route path="/tools/xyz" element={<XYZTool />} /> */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
