import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  type = 'info', 
  title, 
  message,
  children,
  onClose,
  onAction,
  actionLabel,
  className = "",
  icon
}) => {
  const variants = {
    error: {
      container: "border-red-200 bg-red-50",
      icon: "text-red-600",
      title: "text-red-800",
      message: "text-red-700",
      button: "bg-red-600 hover:bg-red-700 text-white"
    },
    success: {
      container: "border-green-200 bg-green-50", 
      icon: "text-green-600",
      title: "text-green-800",
      message: "text-green-700",
      button: "bg-green-600 hover:bg-green-700 text-white"
    },
    warning: {
      container: "border-yellow-200 bg-yellow-50",
      icon: "text-yellow-600", 
      title: "text-yellow-800",
      message: "text-yellow-700",
      button: "bg-yellow-600 hover:bg-yellow-700 text-white"
    },
    info: {
      container: "border-blue-200 bg-blue-50",
      icon: "text-blue-600",
      title: "text-blue-800", 
      message: "text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  };
  
  const defaultIcons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };
  
  const variant = variants[type];
  const displayIcon = icon || defaultIcons[type];
  
  return (
    <div className={`rounded-lg border p-4 ${variant.container} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${variant.icon}`}>
          {displayIcon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold ${variant.title}`}>{title}</h3>
              {message && (
                <p className={`text-sm mt-1 ${variant.message}`}>{message}</p>
              )}
              {children && (
                <div className="mt-2">
                  {children}
                </div>
              )}
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className={`flex-shrink-0 ml-2 ${variant.icon} hover:opacity-70`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {onAction && actionLabel && (
            <div className="mt-3">
              <button
                onClick={onAction}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${variant.button}`}
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo
export const AlertDemo = () => {
  const [alerts, setAlerts] = React.useState([
    { id: 1, type: 'info' as const, title: 'Informacja', message: 'To jest wiadomość informacyjna' },
    { id: 2, type: 'success' as const, title: 'Sukces', message: 'Operacja zakończona pomyślnie' },
    { id: 3, type: 'warning' as const, title: 'Ostrzeżenie', message: 'Uwaga na potencjalny problem' },
    { id: 4, type: 'error' as const, title: 'Błąd', message: 'Wystąpił nieoczekiwany błąd' }
  ]);
  
  const [showToast, setShowToast] = React.useState(false);

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const addAlert = () => {
    const types = ['info', 'success', 'warning', 'error'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newAlert = {
      id: Date.now(),
      type: randomType,
      title: `Nowy alert ${randomType}`,
      message: `To jest nowy alert typu ${randomType}`
    };
    setAlerts([...alerts, newAlert]);
  };

  const retryAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Alert Component</h1>
        
        {/* Basic Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Podstawowe alerty</h2>
          
          <Alert
            type="info"
            title="Informacja"
            message="To jest podstawowy alert informacyjny z wiadomością."
          />
          
          <Alert
            type="success"
            title="Operacja zakończona sukcesem"
            message="Twoje dane zostały pomyślnie zapisane w systemie."
          />
          
          <Alert
            type="warning"
            title="Ostrzeżenie"
            message="Twoje hasło wygaśnie za 7 dni. Zalecamy jego zmianę."
          />
          
          <Alert
            type="error"
            title="Wystąpił błąd"
            message="Nie udało się połączyć z serwerem. Sprawdź połączenie internetowe."
          />
        </div>

        {/* With Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Z akcjami</h2>
          
          <Alert
            type="error"
            title="Błąd połączenia"
            message="Nie udało się załadować danych z serwera."
            onAction={retryAction}
            actionLabel="Spróbuj ponownie"
          />
          
          <Alert
            type="warning"
            title="Niezapisane zmiany"
            message="Masz niezapisane zmiany w formularzu."
            onAction={() => console.log('Zapisano')}
            actionLabel="Zapisz teraz"
          />
          
          <Alert
            type="success"
            title="Aktualizacja dostępna"
            message="Dostępna jest nowa wersja aplikacji."
            onAction={() => console.log('Aktualizacja')}
            actionLabel="Aktualizuj"
          />
        </div>

        {/* Dismissible */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Zamykalne alerty</h2>
            <button
              onClick={addAlert}
              className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              Dodaj alert
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.map(alert => (
              <Alert
                key={alert.id}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                onClose={() => removeAlert(alert.id)}
              />
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Brak alertów. Kliknij "Dodaj alert" aby dodać nowy.
              </div>
            )}
          </div>
        </div>

        {/* With Custom Content */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Z niestandardową zawartością</h2>
          
          <Alert
            type="info"
            title="Aktualizacja systemu"
          >
            <div className="text-sm text-blue-700 space-y-2">
              <p>System będzie niedostępny w następujących godzinach:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sobota, 8 czerwca - 02:00-04:00</li>
                <li>Niedziela, 9 czerwca - 01:00-03:00</li>
              </ul>
              <p className="font-medium">Przepraszamy za niedogodności.</p>
            </div>
          </Alert>
          
          <Alert
            type="warning"
            title="Ograniczenia konta"
          >
            <div className="text-sm text-yellow-700 space-y-2">
              <p>Twoje konto ma następujące ograniczenia:</p>
              <div className="bg-yellow-100 p-3 rounded border">
                <div className="flex justify-between items-center">
                  <span>Przesłane pliki:</span>
                  <span className="font-medium">47/50</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2 mt-1">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </Alert>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50">
            <Alert
              type="success"
              title="Akcja wykonana"
              message="Operacja została pomyślnie zakończona"
              onClose={() => setShowToast(false)}
              className="shadow-lg"
            />
          </div>
        )}

      </div>
    </div>
  );
}