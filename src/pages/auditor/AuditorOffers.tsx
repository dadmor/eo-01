// ------ src/pages/auditor/AuditorOffers.tsx ------
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert,
  StatCard 
} from '../../components/ui/basic';
import { 
  SearchFilter, 
  SelectFilter 
} from '../../components/ui/form';

import { FileCheck, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { auditorApi, AuditorOfferData } from './api/auditors';

export const AuditorOffers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: auditorOffers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auditor-offers'],
    queryFn: auditorApi.getAuditorOffers,
  });

  const filteredOffers = auditorOffers.filter((offer: AuditorOfferData) => {
    const matchesSearch = !searchTerm || 
      offer.audit_requests?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.audit_requests?.street_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || offer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = Array.from(
    new Set(auditorOffers.map(offer => offer.status).filter(Boolean))
  ).map(status => ({ value: status!, label: status! }));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'accepted': return 'Zaakceptowana';
      case 'rejected': return 'Odrzucona';
      case 'pending': return 'Oczekująca';
      default: return status || 'Nieznany';
    }
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
          message="Nie udało się załadować Twoich ofert"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const acceptedOffers = auditorOffers.filter(offer => offer.status === 'accepted');
  const pendingOffers = auditorOffers.filter(offer => offer.status === 'pending');
  const totalValue = acceptedOffers.reduce((sum, offer) => sum + (offer.price || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Moje Oferty Audytu</h1>
          <p className="text-slate-600 mt-1">Zarządzaj swoimi ofertami i śledź ich status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FileCheck className="w-5 h-5" />}
          title="Wszystkie oferty"
          value={auditorOffers.length}
          subtitle="złożonych ofert"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Oczekujące"
          value={pendingOffers.length}
          subtitle="do rozpatrzenia"
          color="yellow"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Wartość zaakceptowanych"
          value={`${totalValue.toLocaleString('pl')} PLN`}
          subtitle="łączna wartość"
          color="green"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchFilter
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Szukaj ofert..."
            />
            <SelectFilter
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              placeholder="Status oferty"
            />
          </div>
        </div>
      </Card>

      {/* Offers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Audyt w {offer.audit_requests?.city || 'Nie podano miasta'}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    {offer.audit_requests?.street_address || 'Adres do uzgodnienia'}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(offer.status)}`}>
                    {getStatusLabel(offer.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  <span>{offer.price?.toLocaleString('pl') || '0'} PLN</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{offer.duration_days || 0} dni</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{offer.audit_requests?.postal_code || ''} {offer.audit_requests?.city || 'Nie podano'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(offer.created_at).toLocaleDateString('pl')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Szczegóły
                </Button>
                {offer.status === 'pending' && (
                  <Button variant="secondary">
                    Edytuj
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak ofert
            </h3>
            <p className="text-slate-600">
              Nie znaleziono ofert spełniających wybrane kryteria.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};