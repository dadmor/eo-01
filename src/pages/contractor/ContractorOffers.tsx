// src/pages/contractor/ContractorOffers.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  Hero,
  Card,
  Button,
  StatCard,
  Alert,
  LoadingState
} from '@/components/ui/basic';
import Table, { Column } from '@/components/ui/table/Table';
import Pagination from '@/components/ui/table/Pagination';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { contractorApi, ContractorOfferData } from './api/contractors';

export const ContractorOffers: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortCol, setSortCol] = useState<keyof ContractorOfferData>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const contractorId = 'current-contractor-id';

  const { data: offers = [], isLoading, error, refetch } = useQuery<ContractorOfferData[]>({
    queryKey: ['contractor-offers', contractorId],
    queryFn: () => contractorApi.getContractorOffers(contractorId),
  });

  if (isLoading) {
    return <LoadingState size="lg" />;
  }
  if (error) {
    return (
      <Container>
        <Section>
          <Alert type="error" title="Błąd" message="Nie udało się załadować ofert." onRetry={() => refetch()} />
        </Section>
      </Container>
    );
  }

  const sorted = [...offers].sort((a, b) => {
    const av = a[sortCol], bv = b[sortCol];
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paged = sorted.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(offers.length / perPage);
  const counts = {
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
  };

  const columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true, width: 'w-24' },
    { key: 'price', label: 'Cena', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Data', sortable: true },
  ];

  const tableData = paged.map(o => ({
    id: o.id,
    price: `${o.price.toLocaleString('pl')} zł`,
    status: o.status,
    created_at: new Date(o.created_at).toLocaleDateString('pl'),
  }));

  return (
    <Container>
      <Hero title="Moje Oferty" subtitle="Zarządzaj swoimi ofertami" />
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<FileText />} title="Wszystkie" value={offers.length} />
          <StatCard icon={<Clock />} title="Oczekujące" value={counts.pending} color="yellow" />
          <StatCard icon={<CheckCircle />} title="Zaakceptowane" value={counts.accepted} color="green" />
          <StatCard icon={<XCircle />} title="Odrzucone" value={counts.rejected} color="red" />
        </div>
      </Section>
      <Section>
        <Card>
          <div className="flex justify-end mb-4">
            <Button variant="primary" icon={<Plus />} onClick={() => navigate('/contractor/offersform')}>
              Nowa oferta
            </Button>
          </div>
          <Table
            columns={columns}
            data={tableData}
            sortColumn={sortCol}
            sortDirection={sortDir}
            onSort={key => {
              if (key === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
              else { setSortCol(key as any); setSortDir('asc'); }
            }}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={offers.length}
            itemsPerPage={perPage}
            onPageChange={setPage}
            onItemsPerPageChange={setPerPage}
          />
        </Card>
      </Section>
    </Container>
  );
};
