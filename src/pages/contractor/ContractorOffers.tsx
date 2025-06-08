// src/pages/contractor/ContractorOffers.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert,
  StatCard 
} from '../../components/ui/basic';
import Table, { Column } from '../../components/ui/table/Table';
import Pagination from '../../components/ui/table/Pagination';

import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { contractorApi } from './api/contractors';

export const ContractorOffers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // TODO: Get contractor ID from auth context
  const contractorId = 'current-contractor-id';

  const {
    data: offers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contractor-offers', contractorId],
    queryFn: () => contractorApi.getContractorOffers(contractorId),
  });

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    const aValue = a[sortColumn as keyof ContractorOfferData];
    const bValue = b[sortColumn as keyof ContractorOfferData];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedOffers = sortedOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(offers.length / itemsPerPage);

  const columns: Column[] = [
    {
      key: 'id',
      label: 'ID Oferty',
      width: 'w-32',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Cena',
      sortable: true,
    },
    {
      key: 'scope',
      label: 'Zakres',
      sortable: false,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
    },
    {
      key: 'created_at',
      label: 'Data utworzenia',
      sortable: true,
    },
  ];

  const tableData = paginatedOffers.map(offer => ({
    id: offer.id,
    price: `${offer.price.toLocaleString('pl')} zł`,
    scope: offer.scope,
    status: offer.status,
    created_at: new Date(offer.created_at).toLocaleDateString('pl'),
  }));

  const statusCounts = {
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Moje Oferty</h1>
          <p className="text-slate-600 mt-1">Zarządzaj swoimi ofertami i śledź ich status</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          Nowa oferta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          title="Wszystkie oferty"
          value={offers.length}
          subtitle="łącznie złożonych"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Oczekujące"
          value={statusCounts.pending}
          subtitle="na odpowiedź"
          color="yellow"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          title="Zaakceptowane"
          value={statusCounts.accepted}
          subtitle="do realizacji"
          color="green"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5" />}
          title="Odrzucone"
          value={statusCounts.rejected}
          subtitle="bez realizacji"
          color="red"
        />
      </div>

      {/* Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Lista ofert</h2>
          <Table
            columns={columns}
            data={tableData}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            loading={isLoading}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={offers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </Card>
    </div>
  );
};