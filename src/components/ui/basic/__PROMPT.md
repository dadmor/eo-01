// src/pages/auth/Login.tsx
import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, Button, Card, LoadingState } from "@/components/ui/basic";

export const Login: React.FC = () => {
  const { getFormData } = useSimpleForm();
  const { login, user, loading: authLoading, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string>("");
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "contractor") navigate("/dashboard");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowResend(false);
    setResendSuccess(false);

    const { email: rawEmail, password: rawPassword } = getFormData(e.currentTarget);

    const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
    const password = Array.isArray(rawPassword) ? rawPassword[0] : rawPassword;

    setLastEmail(email);

    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.message || "Coś poszło nie tak przy logowaniu";
      setError(msg);

      if (
        err.status === 400 ||
        /not confirmed/i.test(msg) ||
        /potwierdzony/i.test(msg)
      ) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await resendConfirmationEmail(lastEmail);
      setResendSuccess(true);
    } catch (err) {
      console.error("Resend error:", err);
      setError("Nie udało się wysłać maila ponownie");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="avatar placeholder mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-base-content">Witaj ponownie</h1>
            <p className="text-base-content/70 mt-2">Zaloguj się do swojego konta</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert
                type="error"
                title="Błąd logowania"
                message={error}
              />
              {showResend && (
                <div className="mt-4 space-y-3">
                  {resendSuccess && (
                    <div className="alert alert-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Mail potwierdzający został wysłany ponownie.
                      </span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={resendLoading}
                    fullWidth
                    className="btn-sm"
                  >
                    {resendLoading ? "Wysyłanie..." : "Wyślij ponownie e-mail potwierdzający"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Adres e-mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="twoj@email.pl"
                  disabled={authLoading || loading}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Hasło</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={authLoading || loading}
                  className="input input-bordered w-full pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center btn btn-ghost btn-sm"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingState loading={loading || authLoading}>
              <Button
                variant="primary"
                fullWidth
                disabled={authLoading || loading}
                onClick={() => {}} // handleSubmit obsługuje to przez form
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </Button>
            </LoadingState>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-base-content/70 text-sm">
              Nie masz konta?{" "}
              <Link
                to="/register"
                className="link link-primary font-medium"
              >
                Zarejestruj się
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// src/pages/auth/Register.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimpleForm } from '@/hooks/useSimpleForm';
import { supabase } from '@/utility';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, UserPlus, Users } from "lucide-react";
import { Alert, Button, Card, LoadingState } from "@/components/ui/basic";

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

    const { email, password, confirmPassword, role } = getFormData(e.currentTarget);
    
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
          <Card className="p-8 text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-success/20 text-success rounded-full w-16">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-base-content mb-4">Rejestracja zakończona!</h1>
            
            <Alert
              type="success"
              title="Sukces"
              message={success}
              className="mb-6"
            />
            
            <Button
              variant="primary"
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
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="avatar placeholder mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16">
                <UserPlus className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-base-content">Utwórz konto</h1>
            <p className="text-base-content/70 mt-2">Zarejestruj się, aby rozpocząć</p>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Adres e-mail *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="twoj@email.pl"
                  disabled={loading}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Typ konta *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Users className="h-5 w-5 text-base-content/40" />
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  disabled={loading}
                  className="select select-bordered w-full pl-10"
                >
                  <option value="">Wybierz typ konta</option>
                  <option value="beneficiary">Beneficjent</option>
                  <option value="auditor">Audytor</option>
                </select>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Beneficjent - osoba korzystająca z usług, Audytor - osoba przeprowadzająca audyty
                </span>
              </label>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Hasło *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="input input-bordered w-full pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center btn btn-ghost btn-sm"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">Minimum 6 znaków</span>
              </label>
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Powtórz hasło *</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="input input-bordered w-full pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center btn btn-ghost btn-sm"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingState loading={loading}>
              <Button
                variant="primary"
                fullWidth
                disabled={loading}
                onClick={() => {}} // handleSubmit obsługuje to przez form
              >
                {loading ? "Tworzenie konta..." : "Utwórz konto"}
              </Button>
            </LoadingState>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-base-content/70 text-sm">
              Masz już konto?{" "}
              <Link
                to="/login"
                className="link link-primary font-medium"
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