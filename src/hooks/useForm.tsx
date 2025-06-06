// src/hooks/useForm.tsx - custom hook do formularzy
import { FormEvent } from "react";

export const useForm = (onSubmit: (data: Record<string, string>) => void) => ({
  onSubmit: (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    onSubmit(data);
  }
});

// src/components/AuthForm.tsx - reużywalny komponent
import React from "react";
import { Link } from "react-router-dom";

interface Field {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

interface AuthFormProps {
  title: string;
  fields: Field[];
  submitText: string;
  loadingText: string;
  isLoading: boolean;
  linkTo: string;
  linkText: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title, fields, submitText, loadingText, isLoading, linkTo, linkText, onSubmit
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">{title}</h2>
      <form className="space-y-6" onSubmit={onSubmit}>
        {fields.map(field => (
          <input
            key={field.name}
            {...field}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? loadingText : submitText}
        </button>
        <div className="text-center">
          <Link to={linkTo} className="font-medium text-indigo-600 hover:text-indigo-500">
            {linkText}
          </Link>
        </div>
      </form>
    </div>
  </div>
);
