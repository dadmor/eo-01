// src/Navigation.tsx - super kompaktowa wersja
import React from "react";
import { Link } from "react-router-dom";
import { useGetIdentity, useLogout } from "@pankod/refine-core";

const Navigation: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity();
  const { mutate: logout } = useLogout();

  const navItems = user ? (
    <>
      <span className="text-gray-700">Witaj, {user.name || "Użytkownik"}</span>
      <Link to="/profile" className="text-blue-600 hover:text-blue-800">Profil</Link>
      <button onClick={() => logout()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Wyloguj
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="text-blue-600 hover:text-blue-800">Logowanie</Link>
      <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Rejestracja
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">Moja Aplikacja</Link>
          <div className="flex items-center space-x-4">
            {isLoading ? <div className="animate-pulse h-4 bg-gray-300 rounded w-20" /> : navItems}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;