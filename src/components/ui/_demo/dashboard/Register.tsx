// src/pages/auth/Register.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleForm } from '@/hooks/useSimpleForm';
import { supabase } from '@/utility';

export const Register: React.FC = () => {
  const { getFormData } = useSimpleForm();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { name, email, password, confirmPassword } = getFormData(e.currentTarget);
    if (password !== confirmPassword) {
      setError('Hasła muszą być takie same');
      return;
    }

    try {
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'beneficiary' } }
      });
      if (signUpError) throw signUpError;
      setSuccess('Konto utworzone. Sprawdź e-mail, aby potwierdzić rejestrację.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm bg-base-100 shadow-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Rejestracja</h2>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Imię i nazwisko</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="input input-bordered"
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="input input-bordered"
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Hasło</span>
              </label>
              <input
                type="password"
                name="password"
                required
                className="input input-bordered"
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Powtórz hasło</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="input input-bordered"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-secondary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              Zarejestruj się
            </button>
          </>
        )}

        {success && (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-primary w-full mt-4"
          >
            Przejdź do logowania
          </button>
        )}
      </form>
    </div>
  );
};
