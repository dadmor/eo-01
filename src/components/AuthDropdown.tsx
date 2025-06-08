// src/components/AuthMenu.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthDropdown: React.FC = () => {
  const { user, logout, delegatedUser } = useAuth(); // Dodajemy delegatedUser z kontekstu
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleOpenDelegatedProfile = () => {
    // Możesz dostosować tę funkcję według potrzeb - np. otworzenie modala, przejście do profilu itp.
    console.log("Otwieranie profilu delegowanego użytkownika:", delegatedUser);
    // navigate(`/profile/${delegatedUser?.id}`);
    // lub otworzenie modala:
    // setShowDelegatedModal(true);
  };

  if (!user) {
    return (
      <button onClick={handleLogin} className="btn btn-sm btn-primary">
        Zaloguj
      </button>
    );
  }

  // Główny użytkownik do wyświetlenia (delegowany lub zwykły)
  const displayUser = delegatedUser || user;
  const isDelegated = !!delegatedUser;

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="avatar avatar-placeholder cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-neutral-300 text-primary-content flex items-center justify-center font-semibold">
          {displayUser.email.charAt(0).toUpperCase()}
        </div>
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-2"
      >
        {/* Informacja o delegacji */}
        {isDelegated && (
          <>
            <li className="menu-title">
              <span className="text-warning font-semibold">
                🔄 Delegowany dostęp
              </span>
            </li>
            <li>
              <button
                onClick={handleOpenDelegatedProfile}
                className="justify-between hover:bg-base-200"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold break-words text-sm">
                    {delegatedUser.email}
                  </span>
                  <span className="text-xs opacity-70">
                    Rola: {delegatedUser.role}
                  </span>
                </div>
                <span className="text-xs">👁️</span>
              </button>
            </li>
            <div className="divider my-1"></div>
            <li className="menu-title">
              <span className="text-xs opacity-60">Twoje konto:</span>
            </li>
          </>
        )}

        {/* Informacje o głównym użytkowniku */}
        <li>
          <span className="font-semibold break-words">
            {isDelegated ? user.email : displayUser.email}
          </span>
        </li>
        <li>
          <span>Rola: {isDelegated ? user.role : displayUser.role}</span>
        </li>

        {/* Opcje wylogowania */}
        <div className="divider my-1"></div>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left text-error"
          >
            Wyloguj
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AuthDropdown;