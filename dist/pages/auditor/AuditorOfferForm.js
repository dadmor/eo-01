import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auditor/AuditorOfferForm.tsx
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Button, LoadingSpinner, Alert } from "../../components/ui/basic";
import { FormField, FormInput, FormTextarea, SelectFilter, } from "../../components/ui/form";
import { FileCheck, DollarSign, Calendar } from "lucide-react";
import { auditorApi } from "./api/auditors";
import { useAuth } from "../../hooks/useAuth";
export const AuditorOfferForm = () => {
    const { user, delegatedUser } = useAuth();
    const currentUser = delegatedUser || user;
    const auditorId = currentUser?.id;
    const [formData, setFormData] = useState({
        request_id: "",
        price: "",
        duration_days: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    // Sprawdź czy użytkownik jest zalogowany jako audytor
    if (!currentUser || !auditorId) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d autoryzacji", message: "Nie mo\u017Cna za\u0142adowa\u0107 danych audytora. Zaloguj si\u0119 ponownie." }) }));
    }
    if (currentUser.role !== "auditor") {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "Brak uprawnie\u0144", message: "Tylko audytorzy mog\u0105 sk\u0142ada\u0107 oferty audytu." }) }));
    }
    const { data: auditRequests = [], isLoading: requestsLoading, error: requestsError, } = useQuery({
        queryKey: ["audit-requests"],
        queryFn: auditorApi.getAuditRequests,
    });
    // DODANO: Pobierz istniejące oferty audytora
    const { data: existingOffers = [], isLoading: offersLoading, error: offersError, } = useQuery({
        queryKey: ["auditor-offers", auditorId],
        queryFn: auditorApi.getAuditorOffers,
    });
    const createOfferMutation = useMutation({
        mutationFn: (offerData) => auditorApi.createAuditorOffer(offerData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auditor-offers"] });
            // Reset form after successful submission
            setFormData({
                request_id: "",
                price: "",
                duration_days: "",
                description: "",
            });
            setErrors({});
        },
        onError: (error) => {
            console.error("Error creating offer:", error);
            // DODANO: Sprawdź czy błąd dotyczy duplikatu
            if (error?.code === '23505' || error?.message?.includes('duplicate key')) {
                setErrors({
                    request_id: "Już złożyłeś ofertę na to zlecenie. Możesz ją edytować w sekcji 'Moje Oferty'."
                });
            }
        },
    });
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.request_id.trim()) {
            newErrors.request_id = "Wybierz zlecenie audytu";
        }
        else {
            // DODANO: Sprawdź czy audytor już złożył ofertę na to zlecenie
            const hasExistingOffer = existingOffers.some((offer) => offer.request_id === formData.request_id && offer.auditor_id === auditorId);
            if (hasExistingOffer) {
                newErrors.request_id = "Już złożyłeś ofertę na to zlecenie. Możesz ją edytować w sekcji 'Moje Oferty'.";
            }
        }
        const price = Number(formData.price);
        if (!formData.price.trim() || isNaN(price) || price <= 0) {
            newErrors.price = "Podaj prawidłową cenę (większą od 0)";
        }
        const duration = Number(formData.duration_days);
        if (!formData.duration_days.trim() ||
            isNaN(duration) ||
            duration <= 0 ||
            !Number.isInteger(duration)) {
            newErrors.duration_days =
                "Podaj prawidłową liczbę dni (liczba całkowita większa od 0)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const offerData = {
            request_id: formData.request_id,
            auditor_id: auditorId,
            price: Number(formData.price),
            duration_days: Number(formData.duration_days),
            description: formData.description.trim() || undefined,
            status: "pending",
        };
        console.log("Submitting auditor offer:", offerData);
        createOfferMutation.mutate(offerData);
    };
    const handleClearForm = () => {
        setFormData({
            request_id: "",
            price: "",
            duration_days: "",
            description: "",
        });
        setErrors({});
    };
    // ZMIENIONO: Filtruj zlecenia, wykluczając te na które audytor już złożył ofertę
    const offeredRequestIds = existingOffers
        .filter(offer => offer.auditor_id === auditorId)
        .map(offer => offer.request_id);
    const availableRequests = auditRequests?.filter((request) => request.beneficiary_id !== auditorId && // Audytor nie może składać ofert na swoje zlecenia
        !offeredRequestIds.includes(request.id) // Wykluczamy zlecenia na które już złożył ofertę
    ) || [];
    // Transform audit requests to options for SelectFilter
    const requestOptions = availableRequests.map((request) => ({
        value: request.id,
        label: `${request.city || "Nie podano miasta"} - ${request.street_address || "Adres do uzgodnienia"}`,
    }));
    const isLoading = requestsLoading || offersLoading;
    const hasError = requestsError || offersError;
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (hasError) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 danych. Spr\u00F3buj od\u015Bwie\u017Cy\u0107 stron\u0119." }) }));
    }
    if (availableRequests.length === 0) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "info", title: "Brak dost\u0119pnych zlece\u0144", message: "Obecnie nie ma dost\u0119pnych zlece\u0144 audytu do z\u0142o\u017Cenia oferty. Sprawd\u017A sekcj\u0119 'Moje Oferty' aby zobaczy\u0107 ju\u017C z\u0142o\u017Cone oferty." }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Nowa Oferta Audytu" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Z\u0142\u00F3\u017C ofert\u0119 na wykonanie audytu" })] }), createOfferMutation.isError && !errors.request_id && (_jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 z\u0142o\u017Cy\u0107 oferty. Spr\u00F3buj ponownie." })), createOfferMutation.isSuccess && (_jsx(Alert, { type: "success", title: "Sukces", message: "Oferta zosta\u0142a z\u0142o\u017Cona pomy\u015Blnie!" })), _jsx(Card, { children: _jsx("div", { className: "p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(FormField, { label: "Wybierz zlecenie audytu", error: errors.request_id, required: true, children: _jsx(SelectFilter, { options: requestOptions, value: formData.request_id, onChange: (value) => handleInputChange("request_id", value), placeholder: "Wybierz zlecenie...", name: "request_id" }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(FormField, { label: "Cena (PLN)", error: errors.price, required: true, children: _jsx(FormInput, { type: "number", name: "price", value: formData.price, onChange: (e) => handleInputChange("price", e.target.value), placeholder: "np. 2500", min: "1", step: "0.01", icon: _jsx(DollarSign, { className: "w-4 h-4" }) }) }), _jsx(FormField, { label: "Czas realizacji (dni)", error: errors.duration_days, required: true, children: _jsx(FormInput, { type: "number", name: "duration_days", value: formData.duration_days, onChange: (e) => handleInputChange("duration_days", e.target.value), placeholder: "np. 14", min: "1", step: "1", icon: _jsx(Calendar, { className: "w-4 h-4" }) }) })] }), _jsxs(FormField, { label: "Dodatkowe informacje (opcjonalne)", children: [_jsx(FormTextarea, { name: "description", value: formData.description, onChange: (e) => handleInputChange("description", e.target.value), placeholder: "Opisz swoje do\u015Bwiadczenie, metodologi\u0119 audytu, certyfikaty...", rows: 4, maxLength: 1000 }), formData.description && (_jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [formData.description.length, "/1000 znak\u00F3w"] }))] }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { variant: "primary", disabled: createOfferMutation.isPending, className: "flex items-center gap-2", children: [createOfferMutation.isPending ? (_jsx(LoadingSpinner, { size: "sm" })) : (_jsx(FileCheck, { className: "w-4 h-4" })), createOfferMutation.isPending ? "Wysyłanie..." : "Złóż ofertę"] }), _jsx(Button, { variant: "outline", onClick: handleClearForm, disabled: createOfferMutation.isPending, children: "Wyczy\u015B\u0107" })] })] }) }) })] }));
};
