// src/App.jsx
import React from "react";
import AccountMenu from './components/AccountMenu';
import OfferPage from "./components/OfferPage";

function App() {
  return (
    <div className="App relative min-h-screen bg-bg-dark">
      {/* Top bar with logo (left) and account (right) */}
      <div className="flex items-center justify-between w-full px-4 md:px-8 pt-4 z-50 absolute top-0 left-0">
        {/* LOGO */}
        <div>
          <img
            src="/src/assets/drippy_logo.png"
            alt="Drippy Logo"
            className="h-24 md:h-36 w-auto object-contain rounded-3xl transition-transform hover:scale-105"
          />
        </div>
        {/* ACCOUNT MENU */}
        <div>
          <AccountMenu />
        </div>
      </div>
      {/* Content */}
      <OfferPage />
    </div>
  );
}

export default App;
