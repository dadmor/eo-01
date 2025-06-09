import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ------ src/pages/auditor/AuditorOffers.tsx ------
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, Alert, StatCard } from '../../components/ui/basic';
import { SearchFilter, SelectFilter } from '../../components/ui/form';
import { FileCheck, MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { auditorApi } from './api/auditors';
export const AuditorOffers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { data: auditorOffers = [], isLoading, error, refetch } = useQuery({
        queryKey: ['auditor-offers'],
        queryFn: auditorApi.getAuditorOffers,
    });
    const filteredOffers = auditorOffers.filter((offer) => {
        const matchesSearch = !searchTerm ||
            offer.audit_requests?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.audit_requests?.street_address?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || offer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const statusOptions = Array.from(new Set(auditorOffers.map(offer => offer.status).filter(Boolean))).map(status => ({ value: status, label: status }));
    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'accepted': return 'Zaakceptowana';
            case 'rejected': return 'Odrzucona';
            case 'pending': return 'Oczekująca';
            default: return status || 'Nieznany';
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 Twoich ofert", onRetry: () => refetch() }) }));
    }
    const acceptedOffers = auditorOffers.filter(offer => offer.status === 'accepted');
    const pendingOffers = auditorOffers.filter(offer => offer.status === 'pending');
    const totalValue = acceptedOffers.reduce((sum, offer) => sum + (offer.price || 0), 0);
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Moje Oferty Audytu" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Zarz\u0105dzaj swoimi ofertami i \u015Bled\u017A ich status" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileCheck, { className: "w-5 h-5" }), title: "Wszystkie oferty", value: auditorOffers.length, subtitle: "z\u0142o\u017Conych ofert", color: "blue" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), title: "Oczekuj\u0105ce", value: pendingOffers.length, subtitle: "do rozpatrzenia", color: "yellow" }), _jsx(StatCard, { icon: _jsx(DollarSign, { className: "w-5 h-5" }), title: "Warto\u015B\u0107 zaakceptowanych", value: `${totalValue.toLocaleString('pl')} PLN`, subtitle: "\u0142\u0105czna warto\u015B\u0107", color: "green" })] }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Filtry" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj ofert..." }), _jsx(SelectFilter, { options: statusOptions, value: statusFilter, onChange: (value) => setStatusFilter(value), placeholder: "Status oferty" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredOffers.map((offer) => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex justify-between items-start mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: ["Audyt w ", offer.audit_requests?.city || 'Nie podano miasta'] }), _jsx("p", { className: "text-slate-600 text-sm mb-3", children: offer.audit_requests?.street_address || 'Adres do uzgodnienia' }), _jsx("span", { className: `inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(offer.status)}`, children: getStatusLabel(offer.status) })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(DollarSign, { className: "w-4 h-4" }), _jsxs("span", { children: [offer.price?.toLocaleString('pl') || '0', " PLN"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: [offer.duration_days || 0, " dni"] })] })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-500 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [offer.audit_requests?.postal_code || '', " ", offer.audit_requests?.city || 'Nie podano'] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: new Date(offer.created_at).toLocaleDateString('pl') })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", className: "flex-1", children: "Szczeg\u00F3\u0142y" }), offer.status === 'pending' && (_jsx(Button, { variant: "secondary", children: "Edytuj" }))] })] }) }, offer.id))) }), filteredOffers.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(FileCheck, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak ofert" }), _jsx("p", { className: "text-slate-600", children: "Nie znaleziono ofert spe\u0142niaj\u0105cych wybrane kryteria." })] }) }))] }));
};
