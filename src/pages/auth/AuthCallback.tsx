// src/pages/auth/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utility';
import { LoadingSpinner } from '@/components/ui/basic/LoadingSpinner';
import { Card } from '@/components/ui/basic/Card';
import { Alert } from '@/components/ui/basic/Alert';
import { CheckCircle, XCircle } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Sprawdź czy mamy parametry w URL (hash lub search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type');
        
        if (type === 'signup' && accessToken) {
          // Email został potwierdzony
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            setStatus('success');
            setMessage('Email został pomyślnie potwierdzony! Przekierowujemy Cię do panelu.');
            
            // Przekieruj po 2 sekundach
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            // Spróbuj pobrać sesję z tokenów z URL
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              throw sessionError;
            }
            
            setStatus('success');
            setMessage('Email został pomyślnie potwierdzony! Przekierowujemy Cię do panelu.');
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        } else if (type === 'recovery') {
          // Reset hasła
          setStatus('success');
          setMessage('Link do resetowania hasła jest aktywny. Przekierowujemy Cię do formularza.');
          
          setTimeout(() => {
            navigate('/reset-password');
          }, 2000);
        } else {
          // Brak odpowiednich parametrów lub nieznany typ
          throw new Error('Nieprawidłowy lub wygasły link aktywacyjny');
        }
        
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Wystąpił błąd podczas potwierdzania konta');
        
        // Przekieruj do logowania po 3 sekundach w przypadku błędu
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LoadingSpinner size="lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Potwierdzanie konta...
              </h1>
              <p className="text-gray-600">
                Proszę czekać, przetwarzamy Twoje żądanie.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Sukces!
              </h1>
              <Alert 
                type="success"
                title="Konto potwierdzone"
                message={message}
                className="mb-4"
              />
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Wystąpił błąd
              </h1>
              <Alert 
                type="error"
                title="Błąd potwierdzenia"
                message={message}
                className="mb-4"
              />
              <p className="text-sm text-gray-500">
                Przekierowujemy Cię do strony logowania...
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};