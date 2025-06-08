// src/pages/operator/OperatorModeration.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert,
  StatCard,

} from '../../components/ui/basic';
import { 
  SearchFilter, 
  SelectFilter 
} from '../../components/ui/form';
import { Shield, Clock, User, Database } from 'lucide-react';
import { operatorApi, ModerationLog } from './api/operator';

const actionLabels = {
  status_changed_to_verified: 'Zweryfikowano',
  status_changed_to_rejected: 'Odrzucono',
  status_changed_to_pending: 'Przywrócono do oczekujących',
  created: 'Utworzono',
  updated: 'Zaktualizowano',
  deleted: 'Usunięto'
} as const;

const tableLabels = {
  service_requests: 'Zapytania o usługi',
  audit_requests: 'Zapytania o audyt',
  contractor_offers: 'Oferty wykonawców',
  auditor_offers: 'Oferty audytorów'
} as const;

export const OperatorModeration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [tableFilter, setTableFilter] = useState('');

  const {
    data: moderationLogs = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['operator-moderation-logs'],
    queryFn: operatorApi.getModerationLogs,
  });

  const filteredLogs = moderationLogs.filter((log: ModerationLog) => {
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = !actionFilter || log.action.includes(actionFilter);
    const matchesTable = !tableFilter || log.target_table === tableFilter;
    
    return matchesSearch && matchesAction && matchesTable;
  });

  const stats = {
    total: moderationLogs.length,
    today: moderationLogs.filter(log => {
      const today = new Date().toDateString();
      return new Date(log.created_at).toDateString() === today;
    }).length,
    thisWeek: moderationLogs.filter(log => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(log.created_at) >= weekAgo;
    }).length,
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
          message="Nie udało się załadować logów moderacji"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel Moderacji</h1>
        <p className="text-slate-600 mt-1">Historia działań moderacyjnych w systemie</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Shield className="w-5 h-5" />}
          title="Wszystkie akcje"
          value={stats.total}
          subtitle="wykonanych"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Dzisiaj"
          value={stats.today}
          subtitle="akcji"
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Ten tydzień"
          value={stats.thisWeek}
          subtitle="akcji"
          color="purple"
        />
      </div>

      {/* Filtry */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchFilter
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Szukaj po akcji, operatorze lub powodzie..."
            />
            <SelectFilter
              options={[
                { value: 'status_changed_to_verified', label: 'Zweryfikowano' },
                { value: 'status_changed_to_rejected', label: 'Odrzucono' },
                { value: 'created', label: 'Utworzono' },
                { value: 'updated', label: 'Zaktualizowano' },
                { value: 'deleted', label: 'Usunięto' }
              ]}
              value={actionFilter}
              onChange={(value) => setActionFilter(value as string)}
              placeholder="Typ akcji"
            />
            <SelectFilter
              options={[
                { value: 'service_requests', label: 'Zapytania o usługi' },
                { value: 'audit_requests', label: 'Zapytania o audyt' },
                { value: 'contractor_offers', label: 'Oferty wykonawców' },
                { value: 'auditor_offers', label: 'Oferty audytorów' }
              ]}
              value={tableFilter}
              onChange={(value) => setTableFilter(value as string)}
              placeholder="Tabela"
            />
          </div>
        </div>
      </Card>

      {/* Lista logów */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {actionLabels[log.action as keyof typeof actionLabels] || log.action}
                    </h3>
                    <Badge color="blue" variant="soft">
                      {tableLabels[log.target_table as keyof typeof tableLabels] || log.target_table}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Operator: {log.users?.name || log.users?.email || 'Nieznany'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span>ID obiektu: {log.target_id.slice(0, 8)}...</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(log.created_at).toLocaleString('pl')}</span>
                      </div>
                      {log.reason && (
                        <div className="text-sm">
                          <strong>Powód:</strong> {log.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak logów
            </h3>
            <p className="text-slate-600">
              Nie znaleziono logów moderacji spełniających wybrane kryteria.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};