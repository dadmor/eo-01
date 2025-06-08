// src/pages/contractor/ContractorMarketplace.tsx
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

import { MapPin, Clock, User, Plus } from 'lucide-react';
import { contractorApi, ServiceRequestData } from './api/contractors';

// Helper function to get display name
const getDisplayName = (user: any) => {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user?.first_name) {
    return user.first_name;
  }
  if (user?.last_name) {
    return user.last_name;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  return 'Anonimowy';
};

export const ContractorMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: serviceRequests = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['service-requests'],
    queryFn: contractorApi.getServiceRequests,
  });

  const filteredRequests = serviceRequests.filter((request: ServiceRequestData) => {
    const matchesSearch = !searchTerm || 
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      request.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      request.postal_code?.includes(locationFilter);
    
    return matchesSearch && matchesLocation;
  });

  const locationOptions = Array.from(
    new Set(serviceRequests.map(req => req.city).filter(Boolean))
  ).map(city => ({ value: city!, label: city! }));

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
          message="Nie udało się załadować zleceń z marketplace"
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
          <h1 className="text-3xl font-bold text-slate-900">Giełda Wykonawców</h1>
          <p className="text-slate-600 mt-1">Znajdź zlecenia dopasowane do Twoich umiejętności</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Plus className="w-5 h-5" />}
          title="Dostępne zlecenia"
          value={filteredRequests.length}
          subtitle="aktywnych ofert"
          color="blue"
        />
        <StatCard
          icon={<MapPin className="w-5 h-5" />}
          title="Lokalizacje"
          value={locationOptions.length}
          subtitle="różnych miast"
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Nowe dzisiaj"
          value={serviceRequests.filter(req => {
            const today = new Date().toDateString();
            return new Date(req.created_at).toDateString() === today;
          }).length}
          subtitle="dodanych dziś"
          color="purple"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchFilter
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Szukaj zleceń..."
            />
            <SelectFilter
              options={locationOptions}
              value={locationFilter}
              onChange={(value) => setLocationFilter(value as string)}
              placeholder="Wybierz miasto"
            />
            <SelectFilter
              options={[
                { value: 'new', label: 'Nowe' },
                { value: 'urgent', label: 'Pilne' },
                { value: 'featured', label: 'Wyróżnione' }
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              placeholder="Status zlecenia"
            />
          </div>
        </div>
      </Card>

      {/* Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {request.title || 'Zlecenie bez tytułu'}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {request.description || 'Brak opisu'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{request.city || 'Nie podano'}, {request.postal_code || ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{getDisplayName(request.users)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(request.created_at).toLocaleDateString('pl')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" className="flex-1">
                  Złóż ofertę
                </Button>
                <Button variant="outline">
                  Szczegóły
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak zleceń
            </h3>
            <p className="text-slate-600">
              Nie znaleziono zleceń spełniających wybrane kryteria.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};