import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/RequestDetail.tsx
// ===================================================================
import { LoadingState, Alert, Card, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Phone, Calendar, Home, Thermometer, Square, DoorOpen, Shield, Clock, CheckCircle, XCircle, AlertCircle, Euro, ArrowLeft, Edit3 } from "lucide-react";
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
    // Helper functions
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-600" });
            case 'verified': return _jsx(CheckCircle, { className: "w-4 h-4 text-green-600" });
            case 'accepted': return _jsx(CheckCircle, { className: "w-4 h-4 text-green-600" });
            default: return _jsx(XCircle, { className: "w-4 h-4 text-red-600" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'verified': return 'bg-green-50 text-green-700 border-green-200';
            case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-red-50 text-red-700 border-red-200';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Oczekujące';
            case 'verified': return 'Zweryfikowane';
            case 'accepted': return 'Zaakceptowane';
            default: return 'Odrzucone';
        }
    };
    const getHeatSourceIcon = (heatSource) => {
        return _jsx(Thermometer, { className: "w-4 h-4 text-orange-600" });
    };
    const getHeatSourceText = (heatSource) => {
        switch (heatSource) {
            case 'pompa_ciepla': return 'Pompa ciepła';
            case 'piec_pellet': return 'Piec na pellet';
            default: return 'Piec zgazowujący';
        }
    };
    if (isLoading)
        return _jsx(LoadingState, { size: "lg" });
    if (!request) {
        return (_jsx(Container, { children: _jsx(Section, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 szczeg\u00F3\u0142\u00F3w zlecenia." }) }) }));
    }
    return (_jsxs(Container, { children: [_jsxs("div", { className: "mb-6", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => navigate('/beneficiary/my-requests'), className: "mb-4 inline-flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Powr\u00F3t do listy"] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Szczeg\u00F3\u0142y Zlecenia" }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium border ${requestType === 'service'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-purple-50 text-purple-700 border-purple-200'}`, children: requestType === 'service' ? 'Wykonawca' : 'Audytor' })] }), _jsxs("div", { className: "flex items-center gap-2 text-slate-600", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [request.city, ", ", request.street_address] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", children: [_jsxs("div", { className: "xl:col-span-3 space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl font-semibold text-slate-900", children: "Informacje podstawowe" }), _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-medium ${getStatusColor(request.status)}`, children: [getStatusIcon(request.status), _jsx("span", { children: getStatusText(request.status) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-500", children: "Kod pocztowy" }), _jsx("div", { className: "font-medium", children: request.postal_code })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Home, { className: "w-5 h-5 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-500", children: "Miasto" }), _jsx("div", { className: "font-medium", children: request.city })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-500", children: "Adres" }), _jsx("div", { className: "font-medium", children: request.street_address })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Phone, { className: "w-5 h-5 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-500", children: "Telefon" }), _jsx("div", { className: "font-medium", children: request.phone_number })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Calendar, { className: "w-5 h-5 text-slate-400 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-slate-500", children: "Data utworzenia" }), _jsx("div", { className: "font-medium", children: new Date(request.created_at).toLocaleDateString('pl') })] })] })] })] }) }), requestType === 'service' && serviceRequest && ((serviceRequest.heat_source || serviceRequest.windows_count || serviceRequest.doors_count ||
                                serviceRequest.wall_insulation_m2 || serviceRequest.attic_insulation_m2) && (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-slate-900 mb-6", children: "Parametry techniczne" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [serviceRequest.heat_source && (_jsxs("div", { className: "flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100", children: [getHeatSourceIcon(serviceRequest.heat_source), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-orange-600 font-medium", children: "\u0179r\u00F3d\u0142o ciep\u0142a" }), _jsx("div", { className: "font-semibold text-orange-800", children: getHeatSourceText(serviceRequest.heat_source) })] })] })), serviceRequest.windows_count && (_jsxs("div", { className: "flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100", children: [_jsx(Square, { className: "w-5 h-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-blue-600 font-medium", children: "Liczba okien" }), _jsx("div", { className: "font-semibold text-blue-800", children: serviceRequest.windows_count })] })] })), serviceRequest.doors_count && (_jsxs("div", { className: "flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100", children: [_jsx(DoorOpen, { className: "w-5 h-5 text-green-600 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-green-600 font-medium", children: "Liczba drzwi" }), _jsx("div", { className: "font-semibold text-green-800", children: serviceRequest.doors_count })] })] })), serviceRequest.wall_insulation_m2 && (_jsxs("div", { className: "flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100", children: [_jsx(Shield, { className: "w-5 h-5 text-purple-600 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-purple-600 font-medium", children: "Izolacja \u015Bcian" }), _jsxs("div", { className: "font-semibold text-purple-800", children: [serviceRequest.wall_insulation_m2, " m\u00B2"] })] })] })), serviceRequest.attic_insulation_m2 && (_jsxs("div", { className: "flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100", children: [_jsx(Home, { className: "w-5 h-5 text-indigo-600 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-indigo-600 font-medium", children: "Izolacja poddasza" }), _jsxs("div", { className: "font-semibold text-indigo-800", children: [serviceRequest.attic_insulation_m2, " m\u00B2"] })] })] }))] })] }) }))), requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-slate-900 mb-6", children: ["Oferty wykonawc\u00F3w (", serviceRequest.contractor_offers.length, ")"] }), _jsx("div", { className: "space-y-4", children: serviceRequest.contractor_offers.map(offer => (_jsx("div", { className: "border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Euro, { className: "w-5 h-5 text-green-600" }), _jsxs("span", { className: "font-bold text-2xl text-green-700", children: [offer.price.toLocaleString('pl'), " z\u0142"] })] }), _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offer.status)}`, children: [getStatusIcon(offer.status), _jsx("span", { children: getStatusText(offer.status) })] })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4 mb-3", children: [_jsx("div", { className: "text-sm text-slate-600 font-medium mb-1", children: "Zakres prac:" }), _jsx("p", { className: "text-slate-700", children: offer.scope })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["Z\u0142o\u017Cona: ", new Date(offer.created_at).toLocaleDateString('pl')] })] })] }), offer.status === 'pending' && (_jsxs("div", { className: "flex gap-2 ml-6", children: [_jsxs(Button, { variant: "primary", size: "sm", onClick: () => acceptContractorOffer(offer.id), className: "inline-flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Akceptuj"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => rejectContractorOffer(offer.id), className: "inline-flex items-center gap-2", children: [_jsx(XCircle, { className: "w-4 h-4" }), "Odrzu\u0107"] })] }))] }) }, offer.id))) })] }) })), requestType === 'audit' && auditRequest?.auditor_offers && auditRequest.auditor_offers.length > 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("h3", { className: "text-xl font-semibold text-slate-900 mb-6", children: ["Oferty audytor\u00F3w (", auditRequest.auditor_offers.length, ")"] }), _jsx("div", { className: "space-y-4", children: auditRequest.auditor_offers.map(offer => (_jsx("div", { className: "border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Euro, { className: "w-5 h-5 text-purple-600" }), _jsxs("span", { className: "font-bold text-2xl text-purple-700", children: [offer.price.toLocaleString('pl'), " z\u0142"] })] }), _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(offer.status)}`, children: [getStatusIcon(offer.status), _jsx("span", { children: getStatusText(offer.status) })] })] }), _jsx("div", { className: "bg-purple-50 rounded-lg p-4 mb-3", children: _jsxs("div", { className: "flex items-center gap-2 text-purple-700", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { className: "font-medium", children: ["Czas realizacji: ", offer.duration_days, " dni"] })] }) }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-500", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["Z\u0142o\u017Cona: ", new Date(offer.created_at).toLocaleDateString('pl')] })] })] }), offer.status === 'pending' && (_jsxs("div", { className: "flex gap-2 ml-6", children: [_jsxs(Button, { variant: "primary", size: "sm", onClick: () => acceptAuditorOffer(offer.id), className: "inline-flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Akceptuj"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => rejectAuditorOffer(offer.id), className: "inline-flex items-center gap-2", children: [_jsx(XCircle, { className: "w-4 h-4" }), "Odrzu\u0107"] })] }))] }) }, offer.id))) })] }) }))] }), _jsx("div", { className: "xl:col-span-1", children: _jsxs("div", { className: "sticky top-6 space-y-6", children: [_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Szybkie akcje" }), _jsxs("div", { className: "space-y-3", children: [request.status === 'pending' && (_jsxs(Button, { variant: "primary", className: "w-full inline-flex items-center gap-2", children: [_jsx(Edit3, { className: "w-4 h-4" }), "Edytuj zlecenie"] })), _jsx(Button, { variant: "outline", className: "w-full", onClick: () => navigate('/beneficiary/operator-contact'), children: "Kontakt z operatorem" })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Informacje" }), _jsxs("div", { className: "space-y-4 text-sm", children: [_jsxs("div", { className: "p-3 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("div", { className: "font-medium text-blue-800 mb-1", children: "Status zlecenia" }), _jsxs("div", { className: "text-blue-700", children: [request.status === 'pending' && 'Zlecenie oczekuje na weryfikację przez operatora.', request.status === 'verified' && 'Zlecenie zostało zweryfikowane i jest dostępne dla wykonawców.', request.status === 'rejected' && 'Zlecenie zostało odrzucone. Skontaktuj się z operatorem.'] })] }), requestType === 'service' && serviceRequest?.contractor_offers && serviceRequest.contractor_offers.length > 0 && (_jsxs("div", { className: "p-3 bg-green-50 rounded-lg border border-green-200", children: [_jsx("div", { className: "font-medium text-green-800 mb-1", children: "Otrzymane oferty" }), _jsxs("div", { className: "text-green-700", children: ["Masz ", serviceRequest.contractor_offers.length, " ofert od wykonawc\u00F3w. Por\u00F3wnaj je i wybierz najlepsz\u0105."] })] }))] })] }) })] }) })] })] }));
};
