// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Moja Aplikacja
          </Link>
          <Link to="/profile" className="text-blue-600 hover:text-blue-800">
            Profil
          </Link>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
