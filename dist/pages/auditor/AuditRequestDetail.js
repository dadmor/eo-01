import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { auditorApi } from './api/auditors';
import { Card, Button, LoadingSpinner, Alert } from '../../components/ui/basic';
export const AuditRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: request, isLoading, error, refetch, } = useQuery({
        queryKey: ['audit-request', id],
        queryFn: () => auditorApi.getAuditRequestById(id),
        enabled: Boolean(id),
    });
    if (isLoading) {
        return (_jsx("div", { className: "p-6 flex justify-center", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    if (error || !request) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 szczeg\u00F3\u0142\u00F3w zlecenia.", onRetry: () => refetch() }) }));
    }
    return (_jsx("div", { className: "p-6", children: _jsx(Card, { children: _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("h2", { className: "text-xl font-bold", children: ["Audyt w ", request.city || '–'] }), _jsxs("p", { children: [_jsx("strong", { children: "Adres:" }), " ", request.street_address || '–'] }), _jsxs("p", { children: [_jsx("strong", { children: "Kod pocztowy:" }), " ", request.postal_code || '–'] }), _jsxs("p", { children: [_jsx("strong", { children: "Status:" }), " ", request.status || '–'] }), _jsxs("p", { children: [_jsx("strong", { children: "Zleceniodawca:" }), " ", request.users?.first_name || request.users?.email || '–'] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx(Button, { variant: "primary", onClick: () => navigate(`/auditor/offer/new?requestId=${request.id}`), children: "Z\u0142\u00F3\u017C ofert\u0119" }), _jsx(Button, { variant: "outline", onClick: () => navigate(-1), children: "Wr\u00F3\u0107" })] })] }) }) }));
};
