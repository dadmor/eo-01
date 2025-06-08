// src/pages/operator/OperatorReports.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert,
  StatCard 
} from '../../components/ui/basic';
import { 
  SearchFilter 
} from '../../components/ui/form';
import { FileText, Plus, Calendar, Download, TrendingUp, Users, Building } from 'lucide-react';
import { operatorApi, Report } from './api/operator';

export const OperatorReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: reports = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['operator-reports'],
    queryFn: operatorApi.getReports,
  });

  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['operator-stats'],
    queryFn: operatorApi.getStats,
  });

  const createReportMutation = useMutation({
    mutationFn: (reportData: { title: string; payload: any }) =>
      operatorApi.createReport({
        operator_id: 'current-operator-id', // TODO: Pobierz z kontekstu auth
        ...reportData
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operator-reports'] });
      setIsCreating(false);
    },
  });

  const filteredReports = reports.filter((report: Report) => {
    return !searchTerm || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const generateSystemReport = async () => {
    if (!stats) return;

    const reportData = {
      title: `Raport systemowy - ${new Date().toLocaleDateString('pl')}`,
      payload: {
        generatedAt: new Date().toISOString(),
        summary: {
          totalServiceRequests: stats.serviceRequestsCount,
          totalAuditRequests: stats.auditRequestsCount,
          totalContractorOffers: stats.contractorOffersCount,
          totalAuditorOffers: stats.auditorOffersCount,
        },
        serviceRequests: {
          byStatus: stats.serviceRequests.reduce((acc: any, req: any) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
          }, {}),
        },
        auditRequests: {
          byStatus: stats.auditRequests.reduce((acc: any, req: any) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
          }, {}),
        },
        offers: {
          contractorOffers: {
            byStatus: stats.contractorOffers.reduce((acc: any, offer: any) => {
              acc[offer.status] = (acc[offer.status] || 0) + 1;
              return acc;
            }, {}),
          },
          auditorOffers: {
            byStatus: stats.auditorOffers.reduce((acc: any, offer: any) => {
              acc[offer.status] = (acc[offer.status] || 0) + 1;
              return acc;
            }, {}),
          },
        }
      }
    };

    createReportMutation.mutate(reportData);
  };

  const downloadReport = (report: Report) => {
    const dataStr = JSON.stringify(report.payload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || statsLoading) {
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
          message="Nie udało się załadować raportów"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Raporty</h1>
          <p className="text-slate-600 mt-1">Generuj i przeglądaj raporty systemowe</p>
        </div>
        <Button
          variant="primary"
          onClick={generateSystemReport}
          disabled={createReportMutation.isPending}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generuj raport
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            title="Zapytania usługowe"
            value={stats.serviceRequestsCount}
            subtitle="wszystkich"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Zapytania audytowe"
            value={stats.auditRequestsCount}
            subtitle="wszystkich"
            color="green"
          />
          <StatCard
            icon={<Building className="w-5 h-5" />}
            title="Oferty wykonawców"
            value={stats.contractorOffersCount}
            subtitle="złożonych"
            color="purple"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            title="Oferty audytorów"
            value={stats.auditorOffersCount}
            subtitle="złożonych"
            color="orange"
          />
        </div>
      )}

      {/* Search */}
      <Card>
        <div className="p-6">
          <SearchFilter
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Szukaj raportów..."
          />
        </div>
      </Card>

      {/* Lista raportów */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {report.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(report.created_at).toLocaleDateString('pl')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>ID: {report.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  {/* Podgląd danych raportu */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Podsumowanie danych:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {report.payload.summary && Object.entries(report.payload.summary).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-medium text-slate-900">{value as number}</div>
                          <div className="text-slate-600 text-xs">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport(report)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Pobierz JSON
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak raportów
            </h3>
            <p className="text-slate-600 mb-4">
              Nie znaleziono raportów spełniających wybrane kryteria.
            </p>
            <Button
              variant="primary"
              onClick={generateSystemReport}
              disabled={createReportMutation.isPending}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Wygeneruj pierwszy raport
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};