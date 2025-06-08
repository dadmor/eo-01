// src/pages/auth/Register.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimpleForm } from '@/hooks/useSimpleForm';
import { supabase } from '@/utility';
import { Eye, EyeOff, Mail, Lock, UserPlus, Users, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";
import { Alert } from "@/components/ui/basic/Alert";
import { LoadingSpinner } from "@/components/ui/basic/LoadingSpinner";

export const Register: React.FC = () => {
  const { getFormData } = useSimpleForm();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { email: rawEmail, password: rawPassword, confirmPassword: rawConfirmPassword, role: rawRole } = getFormData(e.currentTarget);
    
    // Wyciągamy pierwszy element, jeśli to tablica
    const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
    const password = Array.isArray(rawPassword) ? rawPassword[0] : rawPassword;
    const confirmPassword = Array.isArray(rawConfirmPassword) ? rawConfirmPassword[0] : rawConfirmPassword;
    const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
    
    if (password !== confirmPassword) {
      setError('Hasła muszą być takie same');
      return;
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    try {
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            role: role || 'beneficiary'
          } 
        }
      });
      
      if (signUpError) throw signUpError;
      
      setSuccess('Konto utworzone pomyślnie! Sprawdź swoją skrzynkę e-mail, aby potwierdzić rejestrację.');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Wystąpił błąd podczas rejestracji');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Rejestracja zakończona!</h1>
            
            <Alert 
              type="success"
              title="Sukces"
              message={success}
              className="mb-6"
            />
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Przejdź do logowania
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Utwórz konto</h1>
            <p className="text-gray-600 mt-2">Zarejestruj się, aby rozpocząć</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert 
                type="error" 
                title="Błąd rejestracji" 
                message={error}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adres e-mail *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="twoj@email.pl"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Typ konta *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white"
                >
                  <option value="">Wybierz typ konta</option>
                  <option value="beneficiary">Beneficjent</option>
                  <option value="auditor">Audytor</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Beneficjent - osoba korzystająca z usług, Audytor - osoba przeprowadzająca audyty
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Hasło *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum 6 znaków</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Powtórz hasło *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              disabled={loading}
              fullWidth
              onClick={() => {}} // Form submission handled by onSubmit
              icon={loading ? <LoadingSpinner size="sm" /> : undefined}
            >
              {loading ? "Tworzenie konta..." : "Utwórz konto"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Masz już konto?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Zaloguj się
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};