import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auditor/AuditorOfferForm.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Card, Button, LoadingSpinner, Alert } from "../../components/ui/basic";
import { FormField, FormInput, FormTextarea } from "../../components/ui/form";
import { FileCheck, DollarSign, Calendar } from "lucide-react";
import { auditorApi } from "./api/auditors";
import { useAuth } from "../../hooks/useAuth";
export const AuditorOfferForm = () => {
    // All hooks must be called unconditionally
    const { user, delegatedUser } = useAuth();
    const currentUser = delegatedUser || user;
    const auditorId = currentUser?.id;
    const [searchParams] = useSearchParams();
    const presetRequestId = searchParams.get("requestId") || "";
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        request_id: presetRequestId,
        price: "",
        duration_days: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (presetRequestId) {
            setFormData(fd => ({ ...fd, request_id: presetRequestId }));
        }
    }, [presetRequestId]);
    const requestsQuery = useQuery({
        queryKey: ["audit-requests"],
        queryFn: auditorApi.getAuditRequests,
    });
    const offersQuery = useQuery({
        queryKey: ["auditor-offers", auditorId],
        queryFn: () => auditorApi.getAuditorOffers(),
        enabled: !!auditorId,
    });
    const createOfferMutation = useMutation({
        mutationFn: (data) => auditorApi.createAuditorOffer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditor-offers'] });
            setFormData({ request_id: presetRequestId, price: "", duration_days: "", description: "" });
            setErrors({});
        },
        onError: err => {
            if (err?.code === "23505") {
                setErrors({ request_id: "Oferta na to zlecenie już istnieje." });
            }
        },
    });
    // Now that hooks are set up, handle conditional UI
    if (!currentUser || !auditorId) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d autoryzacji", message: "Zaloguj si\u0119 ponownie, aby sk\u0142ada\u0107 oferty." }) }));
    }
    const { data: auditRequests = [], isLoading: loadingReq, error: reqError } = requestsQuery;
    const { data: existingOffers = [], isLoading: loadingOff, error: offError } = offersQuery;
    if (loadingReq || loadingOff) {
        return (_jsx("div", { className: "p-6 flex justify-center", children: _jsx(LoadingSpinner, { size: "lg" }) }));
    }
    if (reqError || offError) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie mo\u017Cna pobra\u0107 danych." }) }));
    }
    // Compute available requests for selection
    const availableRequests = auditRequests.filter(r => r.beneficiary_id !== auditorId &&
        !existingOffers.some(o => o.request_id === r.id));
    if (!presetRequestId && availableRequests.length === 0) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "info", title: "Brak zlece\u0144", message: "Brak dost\u0119pnych zlece\u0144 audytu." }) }));
    }
    // Handlers and validation
    const handleChange = (field, value) => {
        setFormData(fd => ({ ...fd, [field]: value }));
        if (errors[field])
            setErrors(e => ({ ...e, [field]: "" }));
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.request_id)
            newErrors.request_id = "Wybierz zlecenie audytu.";
        const priceNum = Number(formData.price);
        if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
            newErrors.price = "Podaj cenę większą niż 0.";
        }
        const daysNum = Number(formData.duration_days);
        if (!formData.duration_days || isNaN(daysNum) || daysNum <= 0 || !Number.isInteger(daysNum)) {
            newErrors.duration_days = "Podaj liczbę dni większą niż 0.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate())
            return;
        createOfferMutation.mutate({
            request_id: formData.request_id,
            auditor_id: auditorId,
            price: Number(formData.price),
            duration_days: Number(formData.duration_days),
            description: formData.description.trim() || undefined,
            status: "pending",
        });
    };
    const selectedRequest = auditRequests.find(r => r.id === formData.request_id);
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Nowa Oferta Audytu" }), createOfferMutation.isError && (_jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 z\u0142o\u017Cy\u0107 oferty." })), createOfferMutation.isSuccess && (_jsx(Alert, { type: "success", title: "Sukces", message: "Oferta zosta\u0142a z\u0142o\u017Cona." })), _jsxs("form", { onSubmit: onSubmit, className: "space-y-6", children: [_jsx(FormField, { label: "Zlecenie audytu", error: errors.request_id, required: true, children: presetRequestId && selectedRequest ? (_jsxs(Card, { className: "p-4", children: [_jsxs("p", { children: [_jsx("strong", { children: "Miasto:" }), " ", selectedRequest.city || "–"] }), _jsxs("p", { children: [_jsx("strong", { children: "Adres:" }), " ", selectedRequest.street_address || "–"] }), _jsx("input", { type: "hidden", name: "request_id", value: selectedRequest.id })] })) : (_jsxs("select", { name: "request_id", value: formData.request_id, onChange: e => handleChange('request_id', e.target.value), className: "w-full border p-2 rounded", children: [_jsx("option", { value: "", children: "Wybierz zlecenie..." }), availableRequests.map(r => (_jsxs("option", { value: r.id, children: [r.city || '–', " \u2013 ", r.street_address || '–'] }, r.id)))] })) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(FormField, { label: "Cena (PLN)", error: errors.price, required: true, children: _jsx(FormInput, { type: "number", name: "price", value: formData.price, onChange: e => handleChange('price', e.target.value), placeholder: "np. 2500", min: "1", step: "0.01", icon: _jsx(DollarSign, { className: "w-4 h-4" }) }) }), _jsx(FormField, { label: "Czas realizacji (dni)", error: errors.duration_days, required: true, children: _jsx(FormInput, { type: "number", name: "duration_days", value: formData.duration_days, onChange: e => handleChange('duration_days', e.target.value), placeholder: "np. 14", min: "1", step: "1", icon: _jsx(Calendar, { className: "w-4 h-4" }) }) })] }), _jsx(FormField, { label: "Uwagi (opcjonalne)", children: _jsx(FormTextarea, { name: "description", value: formData.description, onChange: e => handleChange('description', e.target.value), rows: 4, placeholder: "Opis..." }) }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { type: "submit", variant: "primary", disabled: createOfferMutation.isPending, className: "flex items-center gap-2", children: [_jsx(FileCheck, { className: "w-4 h-4" }), createOfferMutation.isPending ? 'Wysyłanie...' : 'Złóż ofertę'] }), _jsx(Button, { type: "button", variant: "outline", onClick: () => setFormData({ request_id: presetRequestId, price: '', duration_days: '', description: '' }), disabled: createOfferMutation.isPending, children: "Anuluj" })] })] })] }));
};
