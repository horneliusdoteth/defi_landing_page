//AccountMenut.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const CIRCLE_URL = "https://your-circle-link.com"; // <-- update with your actual Circle link

const AccountMenu = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef();

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      window.addEventListener('mousedown', handler);
    }
    return () => window.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Loading spinner during Auth0 loading
  if (isLoading) {
    return (
      <div className="animate-spin h-8 w-8 border-2 border-blue-light border-t-transparent rounded-full"></div>
    );
  }

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <button
        onClick={() => loginWithRedirect({ prompt: 'login' })}
        className="bg-blue-light hover:bg-blue-mid text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-300"
      >
        Log In
      </button>
    );
  }

  // If authenticated, show account button
  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center bg-off-white text-bg-dark font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-light hover:text-white transition duration-300"
      >
        <span className="mr-2">Account</span>
        {user?.picture ? (
          <img
            src={user.picture}
            alt="avatar"
            className="h-7 w-7 rounded-full border border-blue-light"
          />
        ) : (
          <span className="bg-blue-light text-white rounded-full h-7 w-7 flex items-center justify-center font-bold">
            {user?.name?.[0] || "U"}
          </span>
        )}
        <svg className={`ml-2 w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-off-white text-bg-dark rounded shadow-xl z-50 border border-blue-light">
          <a
            href={CIRCLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-3 hover:bg-blue-light hover:text-white transition font-medium rounded-t"
            onClick={() => setDropdownOpen(false)}
          >
            Community & Courses
          </a>
          <button
            className="w-full text-left block px-6 py-3 hover:bg-red-600 hover:text-white transition font-medium rounded-b"
            onClick={() => {
              setDropdownOpen(false);
              logout({ logoutParams: { returnTo: window.location.origin } });
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
