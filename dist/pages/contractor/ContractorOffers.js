import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/contractor/ContractorOffers.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Section, Hero, Card, Button, StatCard, Alert, LoadingState } from '@/components/ui/basic';
import Table from '@/components/ui/table/Table';
import Pagination from '@/components/ui/table/Pagination';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { contractorApi } from './api/contractors';
export const ContractorOffers = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortCol, setSortCol] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const contractorId = 'current-contractor-id';
    const { data: offers = [], isLoading, error, refetch } = useQuery({
        queryKey: ['contractor-offers', contractorId],
        queryFn: () => contractorApi.getContractorOffers(contractorId),
    });
    if (isLoading) {
        return _jsx(LoadingState, { size: "lg" });
    }
    if (error) {
        return (_jsx(Container, { children: _jsx(Section, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 ofert.", onRetry: () => refetch() }) }) }));
    }
    const sorted = [...offers].sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        if (av < bv)
            return sortDir === 'asc' ? -1 : 1;
        if (av > bv)
            return sortDir === 'asc' ? 1 : -1;
        return 0;
    });
    const paged = sorted.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(offers.length / perPage);
    const counts = {
        pending: offers.filter(o => o.status === 'pending').length,
        accepted: offers.filter(o => o.status === 'accepted').length,
        rejected: offers.filter(o => o.status === 'rejected').length,
    };
    const columns = [
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
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Moje Oferty", subtitle: "Zarz\u0105dzaj swoimi ofertami" }), _jsx(Section, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileText, {}), title: "Wszystkie", value: offers.length }), _jsx(StatCard, { icon: _jsx(Clock, {}), title: "Oczekuj\u0105ce", value: counts.pending, color: "yellow" }), _jsx(StatCard, { icon: _jsx(CheckCircle, {}), title: "Zaakceptowane", value: counts.accepted, color: "green" }), _jsx(StatCard, { icon: _jsx(XCircle, {}), title: "Odrzucone", value: counts.rejected, color: "red" })] }) }), _jsx(Section, { children: _jsxs(Card, { children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx(Button, { variant: "primary", icon: _jsx(Plus, {}), onClick: () => navigate('/contractor/offersform'), children: "Nowa oferta" }) }), _jsx(Table, { columns: columns, data: tableData, sortColumn: sortCol, sortDirection: sortDir, onSort: key => {
                                if (key === sortCol)
                                    setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                else {
                                    setSortCol(key);
                                    setSortDir('asc');
                                }
                            } }), _jsx(Pagination, { currentPage: page, totalPages: totalPages, totalItems: offers.length, itemsPerPage: perPage, onPageChange: setPage, onItemsPerPageChange: setPerPage })] }) })] }));
};
