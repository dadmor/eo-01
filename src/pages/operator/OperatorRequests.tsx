import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  Button,
  LoadingSpinner,
  Alert,
  StatCard
} from '../../components/ui/basic';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { operatorApi, ServiceRequestWithUser } from './api/operator';

export const OperatorRequests: React.FC = () => {
  const {
    data: requests = [],
    isLoading,
    error,
    refetch
  } = useQuery<ServiceRequestWithUser[]>({
    queryKey: ['operator-service-requests'],
    queryFn: operatorApi.getServiceRequestsForVerification,
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    verified: requests.filter(r => r.status === 'verified').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd ładowania"
          message="Nie udało się załadować zapytań"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Zapytania do Weryfikacji</h1>
        <p className="text-slate-600 mt-1">Przeglądaj zapytania oczekujące na weryfikację</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<FileText className="w-5 h-5" />} title="Wszystkie" value={stats.total} color="blue" />
        <StatCard icon={<Clock className="w-5 h-5" />} title="Oczekujące" value={stats.pending} color="yellow" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} title="Zweryfikowane" value={stats.verified} color="green" />
        <StatCard icon={<XCircle className="w-5 h-5" />} title="Odrzucone" value={stats.rejected} color="red" />
      </div>

      <div className="space-y-4">
        {requests.map(req => (
          <Card key={req.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {req.city || 'Nie podano'}, {req.street_address}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {req.users?.name || req.users?.email || 'Anonimowy'}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    req.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : req.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {req.status === 'pending'
                    ? 'Oczekujące'
                    : req.status === 'verified'
                    ? 'Zweryfikowane'
                    : 'Odrzucone'}
                </span>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  Szczegóły
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Brak zapytań</h3>
            <p className="text-slate-600">Nie znaleziono zapytań do weryfikacji.</p>
          </div>
        </Card>
      )}
    </div>
  );
};
