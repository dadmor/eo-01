// src/pages/auth/Register.tsx
import React from "react";
import { useRegister } from "@pankod/refine-core";
import { Link } from "react-router-dom";
import { useSimpleForm } from "../../hooks/useSimpleForm";

export const Register: React.FC = () => {
  const { mutate: register, isLoading } = useRegister();
  const { getFormData } = useSimpleForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = getFormData(e.currentTarget);
    
    if (data.password !== data.confirmPassword) {
      alert("Hasła nie są identyczne");
      return;
    }
    
    if (data.password.length < 6) {
      alert("Hasło musi mieć minimum 6 znaków");
      return;
    }
    
    register({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Utwórz nowe konto
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Adres email"
          />
          <input
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Hasło (min. 6 znaków)"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Potwierdź hasło"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Tworzenie konta..." : "Zarejestruj się"}
          </button>
          <div className="text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};