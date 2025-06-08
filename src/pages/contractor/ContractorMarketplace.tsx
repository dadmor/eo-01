// src/pages/contractor/ContractorMarketplace.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { SearchFilter, SelectFilter } from '../../components/ui/form';
import { contractorApi, ServiceRequestData } from './api/contractors';

import { Plus, MapPin, Clock } from 'lucide-react';
import { CardGrid, Container, EmptyState, ErrorState, Hero, LoadingState, Section } from '@/components/ui/basic';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { FilterBar } from '@/components/ui/table';
import { ServiceRequestCard } from '@/components/ServiceRequestCard';

export const ContractorMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const {
    data: serviceRequests = [],
    isLoading,
    error,
    refetch
  } = useQuery<ServiceRequestData[]>({
    queryKey: ['service-requests'],
    queryFn: contractorApi.getServiceRequests,
  });

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = !searchTerm ||
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter ||
      request.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      request.postal_code?.includes(locationFilter);
    // statusFilter można dodać analogicznie, jeśli backend wspiera
    return matchesSearch && matchesLocation;
  });

  const locationOptions = Array.from(
    new Set(serviceRequests.map(r => r.city).filter(Boolean))
  ).map(city => ({ value: city!, label: city! }));

  const todayStr = new Date().toDateString();
  const newTodayCount = serviceRequests.filter(r =>
    new Date(r.created_at).toDateString() === todayStr
  ).length;

  if (isLoading) {
    return <LoadingState size="lg" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Błąd ładowania"
        message="Nie udało się załadować zleceń z marketplace"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Container>
      <Hero
        title="Giełda Wykonawców"
        subtitle="Znajdź zlecenia dopasowane do Twoich umiejętności"
      />

      <Section>
        <StatsGrid  
          items={[
            {
              icon: <Plus />,
              title: 'Dostępne zlecenia',
              value: filteredRequests.length,
              subtitle: 'aktywnych ofert',
              color: 'blue',
            },
            {
              icon: <MapPin />,
              title: 'Lokalizacje',
              value: locationOptions.length,
              subtitle: 'różnych miast',
              color: 'green',
            },
            {
              icon: <Clock />,
              title: 'Nowe dzisiaj',
              value: newTodayCount,
              subtitle: 'dodanych dziś',
              color: 'purple',
            },
          ]}
          colsMobile={1}
          colsDesktop={3}
        />
      </Section>

      <Section>
        <FilterBar>
          <SearchFilter
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Szukaj zleceń..."
          />
          <SelectFilter
            options={locationOptions}
            value={locationFilter}
            onChange={value => setLocationFilter(value as string)}
            placeholder="Wybierz miasto"
          />
          <SelectFilter
            options={[
              { value: 'new', label: 'Nowe' },
              { value: 'urgent', label: 'Pilne' },
              { value: 'featured', label: 'Wyróżnione' },
            ]}
            value={statusFilter}
            onChange={value => setStatusFilter(value as string)}
            placeholder="Status zlecenia"
          />
        </FilterBar>
      </Section>

      <Section>
        {filteredRequests.length > 0 ? (
          <CardGrid>
            {filteredRequests.map(req => (
              <ServiceRequestCard
                key={req.id}
                request={req}
                onOffer={id => navigate(`/contractor/offersform?requestId=${id}`)}
                onDetails={id => navigate(`/contractor/marketplace/${id}`)}
              />
            ))}
          </CardGrid>
        ) : (
          <EmptyState
            icon={<Plus />}
            title="Brak zleceń"
            message="Nie znaleziono zleceń spełniających wybrane kryteria."
          />
        )}
      </Section>
    </Container>
  );
};
