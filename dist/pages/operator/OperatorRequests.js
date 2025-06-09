import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, Alert, StatCard } from '../../components/ui/basic';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { operatorApi } from './api/operator';
export const OperatorRequests = () => {
    const { data: requests = [], isLoading, error, refetch } = useQuery({
        queryKey: ['operator-service-requests'],
        queryFn: operatorApi.getServiceRequestsForVerification,
    });
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        verified: requests.filter(r => r.status === 'verified').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 zapyta\u0144", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Zapytania do Weryfikacji" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Przegl\u0105daj zapytania oczekuj\u0105ce na weryfikacj\u0119" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileText, { className: "w-5 h-5" }), title: "Wszystkie", value: stats.total, color: "blue" }), _jsx(StatCard, { icon: _jsx(Clock, { className: "w-5 h-5" }), title: "Oczekuj\u0105ce", value: stats.pending, color: "yellow" }), _jsx(StatCard, { icon: _jsx(CheckCircle, { className: "w-5 h-5" }), title: "Zweryfikowane", value: stats.verified, color: "green" }), _jsx(StatCard, { icon: _jsx(XCircle, { className: "w-5 h-5" }), title: "Odrzucone", value: stats.rejected, color: "red" })] }), _jsx("div", { className: "space-y-4", children: requests.map(req => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-900 mb-1", children: [req.city || 'Nie podano', ", ", req.street_address] }), _jsx("p", { className: "text-sm text-slate-600", children: req.users?.name || req.users?.email || 'Anonimowy' })] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${req.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : req.status === 'verified'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'}`, children: req.status === 'pending'
                                            ? 'Oczekujące'
                                            : req.status === 'verified'
                                                ? 'Zweryfikowane'
                                                : 'Odrzucone' })] }), _jsx("div", { className: "flex gap-2 pt-4 border-t", children: _jsx(Button, { variant: "outline", size: "sm", children: "Szczeg\u00F3\u0142y" }) })] }) }, req.id))) }), requests.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx(FileText, { className: "w-8 h-8 text-slate-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak zapyta\u0144" }), _jsx("p", { className: "text-slate-600", children: "Nie znaleziono zapyta\u0144 do weryfikacji." })] }) }))] }));
};
