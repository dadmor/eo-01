import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/operator/OperatorModeration.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, LoadingSpinner, Alert, StatCard, } from '../../components/ui/basic';
import { SearchFilter, SelectFilter } from '../../components/ui/form';
import { Shield, Clock, User, Database } from 'lucide-react';
import { operatorApi } from './api/operator';
const actionLabels = {
    status_changed_to_verified: 'Zweryfikowano',
    status_changed_to_rejected: 'Odrzucono',
    status_changed_to_pending: 'Przywrócono do oczekujących',
    created: 'Utworzono',
    updated: 'Zaktualizowano',
    deleted: 'Usunięto'
};
const tableLabels = {
    service_requests: 'Zapytania o usługi',
    audit_requests: 'Zapytania o audyt',
    contractor_offers: 'Oferty wykonawców',
    auditor_offers: 'Oferty audytorów'
};
export const OperatorModeration = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [tableFilter, setTableFilter] = useState('');
    const { data: moderationLogs = [], isLoading, error, refetch } = useQuery({
        queryKey: ['operator-moderation-logs'],
        queryFn: operatorApi.getModerationLogs,
    });
    const filteredLogs = moderationLogs.filter((log) => {
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
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 log\u00F3w moderacji", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Panel Moderacji" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Historia dzia\u0142a\u0144 moderacyjnych w systemie" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(StatCard, { icon: _jsx(Shield, { className: "w-5 h-5" }), title: "Wszystkie akcje", value: stats.total, subtitle: "wykonanych", color: "blue" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), title: "Dzisiaj", value: stats.today, subtitle: "akcji", color: "green" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), title: "Ten tydzie\u0144", value: stats.thisWeek, subtitle: "akcji", color: "purple" })] }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Filtry" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj po akcji, operatorze lub powodzie..." }), _jsx(SelectFilter, { options: [
                                        { value: 'status_changed_to_verified', label: 'Zweryfikowano' },
                                        { value: 'status_changed_to_rejected', label: 'Odrzucono' },
                                        { value: 'created', label: 'Utworzono' },
                                        { value: 'updated', label: 'Zaktualizowano' },
                                        { value: 'deleted', label: 'Usunięto' }
                                    ], value: actionFilter, onChange: (value) => setActionFilter(value), placeholder: "Typ akcji" }), _jsx(SelectFilter, { options: [
                                        { value: 'service_requests', label: 'Zapytania o usługi' },
                                        { value: 'audit_requests', label: 'Zapytania o audyt' },
                                        { value: 'contractor_offers', label: 'Oferty wykonawców' },
                                        { value: 'auditor_offers', label: 'Oferty audytorów' }
                                    ], value: tableFilter, onChange: (value) => setTableFilter(value), placeholder: "Tabela" })] })] }) }), _jsx("div", { className: "space-y-4", children: filteredLogs.map((log) => (_jsx(Card, { children: _jsx("div", { className: "p-6", children: _jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: actionLabels[log.action] || log.action }), _jsx(Badge, { color: "blue", variant: "soft", children: tableLabels[log.target_table] || log.target_table })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4" }), _jsxs("span", { children: ["Operator: ", log.users?.name || log.users?.email || 'Nieznany'] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Database, { className: "w-4 h-4" }), _jsxs("span", { children: ["ID obiektu: ", log.target_id.slice(0, 8), "..."] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: new Date(log.created_at).toLocaleString('pl') })] }), log.reason && (_jsxs("div", { className: "text-sm", children: [_jsx("strong", { children: "Pow\u00F3d:" }), " ", log.reason] }))] })] })] }) }) }) }, log.id))) }), filteredLogs.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Shield, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak log\u00F3w" }), _jsx("p", { className: "text-slate-600", children: "Nie znaleziono log\u00F3w moderacji spe\u0142niaj\u0105cych wybrane kryteria." })] }) }))] }));
};
