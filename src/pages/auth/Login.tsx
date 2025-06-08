// src/pages/auth/Login.tsx
import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";
import { Alert } from "@/components/ui/basic/Alert";
import { LoadingSpinner } from "@/components/ui/basic/LoadingSpinner";

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
        <Card className="shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Witaj ponownie</h1>
            <p className="text-gray-600 mt-2">Zaloguj się do swojego konta</p>
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
                    <Card className="border-green-200 bg-green-50 p-3">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-800 text-sm">
                          Mail potwierdzający został wysłany ponownie.
                        </span>
                      </div>
                    </Card>
                  )}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleResend}
                    disabled={resendLoading}
                    fullWidth
                    icon={resendLoading ? <LoadingSpinner size="sm" /> : undefined}
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adres e-mail
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
                  disabled={authLoading || loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
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
                  disabled={authLoading || loading}
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
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              disabled={authLoading || loading}
              fullWidth
              onClick={() => {}} // Form submission handled by onSubmit
              icon={loading ? <LoadingSpinner size="sm" /> : undefined}
            >
              {loading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Nie masz konta?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
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