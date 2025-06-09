import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ------ src/pages/auditor/AuditorMarketplace.tsx ------
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, Alert, StatCard } from '../../components/ui/basic';
import { SearchFilter, SelectFilter } from '../../components/ui/form';
import { MapPin, Clock, User, FileCheck, Phone } from 'lucide-react';
import { auditorApi } from './api/auditors';
// Helper function to get display name
const getDisplayName = (user) => {
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
export const AuditorMarketplace = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { data: auditRequests = [], isLoading, error, refetch } = useQuery({
        queryKey: ['audit-requests'],
        queryFn: auditorApi.getAuditRequests,
    });
    const filteredRequests = auditRequests.filter((request) => {
        const matchesSearch = !searchTerm ||
            request.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.street_address?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter ||
            request.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            request.postal_code?.includes(locationFilter);
        const matchesStatus = !statusFilter || request.status === statusFilter;
        return matchesSearch && matchesLocation && matchesStatus;
    });
    const locationOptions = Array.from(new Set(auditRequests.map(req => req.city).filter(Boolean))).map(city => ({ value: city, label: city }));
    const statusOptions = Array.from(new Set(auditRequests.map(req => req.status).filter(Boolean))).map(status => ({ value: status, label: status }));
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 \u017C\u0105da\u0144 audytu z marketplace", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Gie\u0142da Audytor\u00F3w" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Znajd\u017A zlecenia audytu dopasowane do Twoich kompetencji" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileCheck, { className: "w-5 h-5" }), title: "Dost\u0119pne audyty", value: filteredRequests.length, subtitle: "aktywnych zlece\u0144", color: "blue" }), _jsx(StatCard, { icon: _jsx(MapPin, { className: "w-5 h-5" }), title: "Lokalizacje", value: locationOptions.length, subtitle: "r\u00F3\u017Cnych miast", color: "green" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), title: "Nowe dzisiaj", value: auditRequests.filter(req => {
                            const today = new Date().toDateString();
                            return new Date(req.created_at).toDateString() === today;
                        }).length, subtitle: "dodanych dzi\u015B", color: "purple" })] }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Filtry" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj audyt\u00F3w..." }), _jsx(SelectFilter, { options: locationOptions, value: locationFilter, onChange: (value) => setLocationFilter(value), placeholder: "Wybierz miasto" }), _jsx(SelectFilter, { options: statusOptions, value: statusFilter, onChange: (value) => setStatusFilter(value), placeholder: "Status zlecenia" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredRequests.map((request) => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex justify-between items-start mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: ["Audyt w ", request.city || 'Nie podano miasta'] }), _jsx("p", { className: "text-slate-600 text-sm mb-3", children: request.street_address || 'Adres do uzgodnienia' }), request.status && (_jsx("span", { className: `inline-block px-2 py-1 text-xs rounded-full ${request.status === 'active' ? 'bg-green-100 text-green-800' :
                                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'}`, children: request.status }))] }) }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-500 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [request.postal_code || '', " ", request.city || 'Nie podano'] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { children: getDisplayName(request.users) })] }), request.phone_number && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: request.phone_number })] })), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: new Date(request.created_at).toLocaleDateString('pl') })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "primary", className: "flex-1", children: "Z\u0142\u00F3\u017C ofert\u0119" }), _jsx(Button, { variant: "outline", children: "Szczeg\u00F3\u0142y" })] })] }) }, request.id))) }), filteredRequests.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(FileCheck, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak zlece\u0144 audytu" }), _jsx("p", { className: "text-slate-600", children: "Nie znaleziono zlece\u0144 spe\u0142niaj\u0105cych wybrane kryteria." })] }) }))] }));
};
