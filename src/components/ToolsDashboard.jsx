// ToolsDashboard.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function ToolsDashboard() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="max-w-3xl mx-auto my-16">
      <h1 className="text-3xl font-bold mb-8 text-blue-light">Drippy DeFi Tools</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to={isAuthenticated ? "/tools/impermanent-loss" : "#"}
          className={
            "block bg-bg-dark p-6 rounded-2xl shadow hover:scale-105 hover:shadow-lg transition " +
            (!isAuthenticated ? "opacity-60 pointer-events-none" : "")
          }
        >
          <div className="text-xl font-semibold text-off-white mb-2">Impermanent Loss Calculator</div>
          <p className="text-blue-light text-sm">Simulate and visualize impermanent loss for liquidity pools.</p>
          {!isAuthenticated && (
            <div className="text-red-400 mt-2 text-xs font-semibold">Members Only – Please Log In</div>
          )}
        </Link>
      </div>
    </div>
  );
}
