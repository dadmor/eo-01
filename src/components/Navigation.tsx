// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";
import AuthDropdown from "./AuthDropdown";

const Navigation: React.FC = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg fixed top-0 w-full z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          Moja Aplikacja
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/profile" className="btn btn-ghost">
              Profil
            </Link>
          </li>
          <li>
            <Link to="/admin/users">U</Link>
          </li>
          <li>
            <Link to="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <AuthDropdown />
      </div>
      
      {/* Mobile menu */}
      <div className="dropdown lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <Link to="/profile">Profil</Link>
          </li>
          <li>
            <Link to="/admin/users">U</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;