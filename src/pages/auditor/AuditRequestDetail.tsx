// src/pages/auditor/AuditRequestDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { auditorApi, AuditRequestData } from './api/auditors';
import { Card, Button, LoadingSpinner, Alert } from '../../components/ui/basic';

export const AuditRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: request,
    isLoading,
    error,
    refetch,
  } = useQuery<AuditRequestData | null>({
    queryKey: ['audit-request', id],
    queryFn: () => auditorApi.getAuditRequestById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd ładowania"
          message="Nie udało się załadować szczegółów zlecenia."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Audyt w {request.city || '–'}</h2>
          <p><strong>Adres:</strong> {request.street_address || '–'}</p>
          <p><strong>Kod pocztowy:</strong> {request.postal_code || '–'}</p>
          <p><strong>Status:</strong> {request.status || '–'}</p>
          <p><strong>Zleceniodawca:</strong> {request.users?.first_name || request.users?.email || '–'}</p>

          <div className="flex gap-4 pt-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/auditor/offer/new?requestId=${request.id}`)}
            >
              Złóż ofertę
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Wróć
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
