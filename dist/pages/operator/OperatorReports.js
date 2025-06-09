import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/operator/OperatorReports.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, Alert, StatCard } from '../../components/ui/basic';
import { SearchFilter } from '../../components/ui/form';
import { FileText, Plus, Calendar, Download, TrendingUp, Users, Building } from 'lucide-react';
import { operatorApi } from './api/operator';
export const OperatorReports = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const queryClient = useQueryClient();
    const { data: reports = [], isLoading, error, refetch } = useQuery({
        queryKey: ['operator-reports'],
        queryFn: operatorApi.getReports,
    });
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['operator-stats'],
        queryFn: operatorApi.getStats,
    });
    const createReportMutation = useMutation({
        mutationFn: (reportData) => operatorApi.createReport({
            operator_id: 'current-operator-id',
            ...reportData
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operator-reports'] });
            setIsCreating(false);
        },
    });
    const filteredReports = reports.filter((report) => {
        return !searchTerm ||
            report.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const generateSystemReport = async () => {
        if (!stats)
            return;
        const reportData = {
            title: `Raport systemowy - ${new Date().toLocaleDateString('pl')}`,
            payload: {
                generatedAt: new Date().toISOString(),
                summary: {
                    totalServiceRequests: stats.serviceRequestsCount,
                    totalAuditRequests: stats.auditRequestsCount,
                    totalContractorOffers: stats.contractorOffersCount,
                    totalAuditorOffers: stats.auditorOffersCount,
                },
                serviceRequests: {
                    byStatus: stats.serviceRequests.reduce((acc, req) => {
                        acc[req.status] = (acc[req.status] || 0) + 1;
                        return acc;
                    }, {}),
                },
                auditRequests: {
                    byStatus: stats.auditRequests.reduce((acc, req) => {
                        acc[req.status] = (acc[req.status] || 0) + 1;
                        return acc;
                    }, {}),
                },
                offers: {
                    contractorOffers: {
                        byStatus: stats.contractorOffers.reduce((acc, offer) => {
                            acc[offer.status] = (acc[offer.status] || 0) + 1;
                            return acc;
                        }, {}),
                    },
                    auditorOffers: {
                        byStatus: stats.auditorOffers.reduce((acc, offer) => {
                            acc[offer.status] = (acc[offer.status] || 0) + 1;
                            return acc;
                        }, {}),
                    },
                }
            }
        };
        createReportMutation.mutate(reportData);
    };
    const downloadReport = (report) => {
        const dataStr = JSON.stringify(report.payload, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    if (isLoading || statsLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 raport\u00F3w", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Raporty" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Generuj i przegl\u0105daj raporty systemowe" })] }), _jsxs(Button, { variant: "primary", onClick: generateSystemReport, disabled: createReportMutation.isPending, className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Generuj raport"] })] }), stats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileText, { className: "w-5 h-5" }), title: "Zapytania us\u0142ugowe", value: stats.serviceRequestsCount, subtitle: "wszystkich", color: "blue" }), _jsx(StatCard, { icon: _jsx(TrendingUp, { className: "w-5 h-5" }), title: "Zapytania audytowe", value: stats.auditRequestsCount, subtitle: "wszystkich", color: "green" }), _jsx(StatCard, { icon: _jsx(Building, { className: "w-5 h-5" }), title: "Oferty wykonawc\u00F3w", value: stats.contractorOffersCount, subtitle: "z\u0142o\u017Conych", color: "purple" }), _jsx(StatCard, { icon: _jsx(Users, { className: "w-5 h-5" }), title: "Oferty audytor\u00F3w", value: stats.auditorOffersCount, subtitle: "z\u0142o\u017Conych", color: "yellow" })] })), _jsx(Card, { children: _jsx("div", { className: "p-6", children: _jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj raport\u00F3w..." }) }) }), _jsx("div", { className: "space-y-4", children: filteredReports.map((report) => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: report.title }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-600 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: new Date(report.created_at).toLocaleDateString('pl') })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(FileText, { className: "w-4 h-4" }), _jsxs("span", { children: ["ID: ", report.id.slice(0, 8)] })] })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [_jsx("h4", { className: "font-medium text-slate-900 mb-2", children: "Podsumowanie danych:" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: report.payload.summary && Object.entries(report.payload.summary).map(([key, value]) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-medium text-slate-900", children: value }), _jsx("div", { className: "text-slate-600 text-xs", children: key })] }, key))) })] })] }) }), _jsx("div", { className: "flex gap-2 pt-4 border-t", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => downloadReport(report), className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Pobierz JSON"] }) })] }) }, report.id))) }), filteredReports.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(FileText, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak raport\u00F3w" }), _jsx("p", { className: "text-slate-600 mb-4", children: "Nie znaleziono raport\u00F3w spe\u0142niaj\u0105cych wybrane kryteria." }), _jsxs(Button, { variant: "primary", onClick: generateSystemReport, disabled: createReportMutation.isPending, className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Wygeneruj pierwszy raport"] })] }) }))] }));
};
