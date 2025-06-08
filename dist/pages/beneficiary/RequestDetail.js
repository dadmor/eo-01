import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/RequestDetail.tsx
// ===================================================================
import { LoadingState, Alert, Hero, Card, InfoField, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";
export const RequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { user, delegatedUser } = useAuth();
    const currentUser = delegatedUser || user;
    const beneficiaryId = currentUser?.id;
    // Sprawdź czy użytkownik jest zalogowany
    if (!currentUser || !beneficiaryId) {
        return (_jsx(Container, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie mo\u017Cna za\u0142adowa\u0107 danych u\u017Cytkownika. Zaloguj si\u0119 ponownie." }) }));
    }
    // Spróbuj pobrać jako service request
    const { data: serviceRequest, isLoading: loadingSR, error: errorSR } = useQuery({
        queryKey: ['service-request', id],
        queryFn: () => beneficiaryApi.getServiceRequestById(id),
        enabled: !!id,
        retry: false,
    });
    // Spróbuj pobrać jako audit request
    const { data: auditRequests, isLoading: loadingAR, error: errorAR } = useQuery({
        queryKey: ['audit-requests', beneficiaryId],
        queryFn: () => beneficiaryApi.getAuditRequests(beneficiaryId),
        enabled: !!id && !serviceRequest && !loadingSR,
    });
    // Znajdź audit request po ID
    const auditRequest = auditRequests?.find(req => req.id === id);
    const isLoading = loadingSR || loadingAR;
    const request = serviceRequest || auditRequest;
    const requestType = serviceRequest ? 'service' : auditRequest ? 'audit' : null;
    const { mutate: acceptContractorOffer } = useMutation({
        mutationFn: beneficiaryApi.acceptContractorOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['service-request', id] });
        },
    });
    const { mutate: rejectContractorOffer } = useMutation({
        mutationFn: beneficiaryApi.rejectContractorOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['service-request', id] });
        },
    });
    const { mutate: acceptAuditorOffer } = useMutation({
        mutationFn: beneficiaryApi.acceptAuditorOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['audit-requests', beneficiaryId] });
        },
    });
    const { mutate: rejectAuditorOffer } = useMutation({
        mutationFn: beneficiaryApi.rejectAuditorOffer,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['audit-requests', beneficiaryId] });
        },
    });
    if (isLoading)
        return _jsx(LoadingState, { size: "lg" });
    if (!request) {
        return (_jsx(Container, { children: _jsx(Section, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 szczeg\u00F3\u0142\u00F3w zlecenia." }) }) }));
    }
    return (_jsxs(Container, { children: [_jsx(Hero, { title: `Szczegóły Zlecenia ${requestType === 'service' ? 'Wykonawcy' : 'Audytora'}`, subtitle: `${request.city}, ${request.street_address}` }), _jsx(Section, { children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Informacje o zleceniu" }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${requestType === 'service'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-purple-100 text-purple-800'}`, children: requestType === 'service' ? 'Wykonawca' : 'Audytor' })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(InfoField, { label: "Kod pocztowy", value: request.postal_code }), _jsx(InfoField, { label: "Miasto", value: request.city }), _jsx(InfoField, { label: "Adres", value: request.street_address }), _jsx(InfoField, { label: "Telefon", value: request.phone_number }), _jsx(InfoField, { label: "Status", value: _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            request.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'}`, children: request.status === 'pending' ? 'Oczekujące' :
                                                            request.status === 'verified' ? 'Zweryfikowane' : 'Odrzucone' }) }), _jsx(InfoField, { label: "Data utworzenia", value: new Date(request.created_at).toLocaleDateString('pl') })] }), requestType === 'service' && serviceRequest && ((serviceRequest.heat_source || serviceRequest.windows_count || serviceRequest.doors_count ||
                                            serviceRequest.wall_insulation_m2 || serviceRequest.attic_insulation_m2) && (_jsxs("div", { className: "mt-6 pt-6 border-t", children: [_jsx("h4", { className: "font-medium mb-4", children: "Parametry techniczne" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [serviceRequest.heat_source && (_jsx(InfoField, { label: "\u0179r\u00F3d\u0142o ciep\u0142a", value: serviceRequest.heat_source === 'pompa_ciepla' ? 'Pompa ciepła' :
                                                                serviceRequest.heat_source === 'piec_pellet' ? 'Piec na pellet' :
                                                                    'Piec zgazowujący' })), serviceRequest.windows_count && (_jsx(InfoField, { label: "Liczba okien", value: serviceRequest.windows_count })), serviceRequest.doors_count && (_jsx(InfoField, { label: "Liczba drzwi", value: serviceRequest.doors_count })), serviceRequest.wall_insulation_m2 && (_jsx(InfoField, { label: "Izolacja \u015Bcian (m\u00B2)", value: serviceRequest.wall_insulation_m2 })), serviceRequest.attic_insulation_m2 && (_jsx(InfoField, { label: "Izolacja poddasza (m\u00B2)", value: serviceRequest.attic_insulation_m2 }))] })] })))] }) }) }), _jsx("div", { children: _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Akcje" }), _jsxs("div", { className: "space-y-3", children: [_jsx(Button, { variant: "outline", className: "w-full", onClick: () => navigate('/beneficiary/my-requests'), children: "Powr\u00F3t do listy" }), request.status === 'pending' && (_jsx(Button, { variant: "outline", className: "w-full", children: "Edytuj zlecenie" }))] })] }) }) })] }) }), requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (_jsxs(Section, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Oferty wykonawc\u00F3w" }), _jsx("div", { className: "space-y-4", children: serviceRequest.contractor_offers.map(offer => (_jsx(Card, { children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: "font-medium text-lg", children: [offer.price.toLocaleString('pl'), " z\u0142"] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'}`, children: offer.status === 'pending' ? 'Oczekująca' :
                                                                offer.status === 'accepted' ? 'Zaakceptowana' : 'Odrzucona' })] }), _jsx("p", { className: "text-slate-600 mb-3", children: offer.scope }), _jsxs("p", { className: "text-sm text-slate-500", children: ["Z\u0142o\u017Cona: ", new Date(offer.created_at).toLocaleDateString('pl')] })] }), offer.status === 'pending' && (_jsxs("div", { className: "flex gap-2 ml-4", children: [_jsx(Button, { variant: "primary", size: "sm", onClick: () => acceptContractorOffer(offer.id), children: "Akceptuj" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => rejectContractorOffer(offer.id), children: "Odrzu\u0107" })] }))] }) }) }, offer.id))) })] })), requestType === 'audit' && auditRequest?.auditor_offers && auditRequest.auditor_offers.length > 0 && (_jsxs(Section, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Oferty audytor\u00F3w" }), _jsx("div", { className: "space-y-4", children: auditRequest.auditor_offers.map(offer => (_jsx(Card, { children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: "font-medium text-lg", children: [offer.price.toLocaleString('pl'), " z\u0142"] }), _jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'}`, children: offer.status === 'pending' ? 'Oczekująca' :
                                                                offer.status === 'accepted' ? 'Zaakceptowana' : 'Odrzucona' })] }), _jsxs("p", { className: "text-slate-600 mb-3", children: ["Czas realizacji: ", offer.duration_days, " dni"] }), _jsxs("p", { className: "text-sm text-slate-500", children: ["Z\u0142o\u017Cona: ", new Date(offer.created_at).toLocaleDateString('pl')] })] }), offer.status === 'pending' && (_jsxs("div", { className: "flex gap-2 ml-4", children: [_jsx(Button, { variant: "primary", size: "sm", onClick: () => acceptAuditorOffer(offer.id), children: "Akceptuj" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => rejectAuditorOffer(offer.id), children: "Odrzu\u0107" })] }))] }) }) }, offer.id))) })] }))] }));
};
