import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/MyRequests.tsx
// ===================================================================
import { LoadingState, Alert, Hero, StatCard, Button, Card, EmptyState, Container, Section } from "@/components/ui/basic";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";
export const MyRequests = () => {
    const navigate = useNavigate();
    const { user, delegatedUser } = useAuth();
    // Użyj delegatedUser jeśli istnieje, w przeciwnym razie user
    const currentUser = delegatedUser || user;
    const beneficiaryId = currentUser?.id;
    // Dodaj sprawdzenie czy użytkownik jest zalogowany
    if (!currentUser || !beneficiaryId) {
        return (_jsx(Container, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie mo\u017Cna za\u0142adowa\u0107 danych u\u017Cytkownika. Zaloguj si\u0119 ponownie." }) }));
    }
    const { data: serviceRequests = [], isLoading: loadingSR, error: errorSR } = useQuery({
        queryKey: ['service-requests', beneficiaryId],
        queryFn: () => beneficiaryApi.getServiceRequests(beneficiaryId),
    });
    const { data: auditRequests = [], isLoading: loadingAR, error: errorAR } = useQuery({
        queryKey: ['audit-requests', beneficiaryId],
        queryFn: () => beneficiaryApi.getAuditRequests(beneficiaryId),
    });
    const isLoading = loadingSR || loadingAR;
    const error = errorSR || errorAR;
    if (isLoading) {
        return _jsx(LoadingState, { size: "lg" });
    }
    if (error) {
        return (_jsx(Container, { children: _jsx(Section, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 zlece\u0144." }) }) }));
    }
    const allRequests = [
        ...serviceRequests.map(r => ({ ...r, type: 'service' })),
        ...auditRequests.map(r => ({ ...r, type: 'audit' })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Moje Zlecenia", subtitle: "Zarz\u0105dzaj swoimi zleceniami" }), _jsx(Section, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(StatCard, { icon: _jsx(FileText, {}), title: "Wszystkie", value: allRequests.length }), _jsx(StatCard, { icon: _jsx(Clock, {}), title: "Oczekuj\u0105ce", value: allRequests.filter(r => r.status === 'pending').length, color: "yellow" }), _jsx(StatCard, { icon: _jsx(CheckCircle, {}), title: "Zweryfikowane", value: allRequests.filter(r => r.status === 'verified').length, color: "green" })] }) }), _jsxs(Section, { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Lista zlece\u0144" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", onClick: () => navigate('/beneficiary/service-request'), children: "Nowe zlecenie wykonawcy" }), _jsx(Button, { variant: "primary", onClick: () => navigate('/beneficiary/audit-request'), children: "Nowe zlecenie audytora" })] })] }), allRequests.length > 0 ? (_jsx("div", { className: "space-y-4", children: allRequests.map(req => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${req.type === 'service'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-purple-100 text-purple-800'}`, children: req.type === 'service' ? 'Wykonawca' : 'Audytor' }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    req.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                                        'bg-red-100 text-red-800'}`, children: req.status === 'pending' ? 'Oczekujące' :
                                                                    req.status === 'verified' ? 'Zweryfikowane' : 'Odrzucone' })] }), _jsxs("h3", { className: "font-medium text-lg", children: [req.city, ", ", req.street_address] }), _jsx("p", { className: "text-slate-600", children: req.postal_code })] }), _jsx(Button, { variant: "outline", onClick: () => navigate(`/beneficiary/requests/${req.id}`), children: "Szczeg\u00F3\u0142y" })] }), _jsxs("div", { className: "text-sm text-slate-500", children: ["Utworzone: ", new Date(req.created_at).toLocaleDateString('pl')] }), req.type === 'service' && req.contractor_offers?.length > 0 && (_jsx("div", { className: "mt-3 text-sm", children: _jsxs("span", { className: "text-green-600 font-medium", children: [req.contractor_offers.length, " ofert"] }) })), req.type === 'audit' && req.auditor_offers?.length > 0 && (_jsx("div", { className: "mt-3 text-sm", children: _jsxs("span", { className: "text-green-600 font-medium", children: [req.auditor_offers.length, " ofert"] }) }))] }) }, `${req.type}-${req.id}`))) })) : (_jsx(EmptyState, { icon: _jsx(FileText, {}), title: "Brak zlece\u0144", message: "Nie masz jeszcze \u017Cadnych zlece\u0144." }))] })] }));
};
