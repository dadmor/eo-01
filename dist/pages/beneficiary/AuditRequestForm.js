import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/AuditRequestForm.tsx
// ===================================================================
import { Hero, Alert, Card, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MapPin, Home, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth"; // Dodaj import
export const AuditRequestForm = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const { user, delegatedUser } = useAuth(); // Pobierz dane użytkownika
    // Użyj delegatedUser jeśli istnieje, w przeciwnym razie user
    const currentUser = delegatedUser || user;
    const beneficiaryId = currentUser?.id;
    // Dodaj sprawdzenie czy użytkownik jest zalogowany
    if (!currentUser || !beneficiaryId) {
        return (_jsx(Container, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie mo\u017Cna za\u0142adowa\u0107 danych u\u017Cytkownika. Zaloguj si\u0119 ponownie." }) }));
    }
    const [formData, setFormData] = useState({
        postal_code: '',
        city: '',
        street_address: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState({});
    const { mutate: createRequest, isPending, error } = useMutation({
        mutationFn: async (data) => {
            console.log('Sending audit request with data:', { ...data, beneficiary_id: beneficiaryId });
            try {
                const result = await beneficiaryApi.createAuditRequest({ ...data, beneficiary_id: beneficiaryId });
                console.log('Audit request created successfully:', result);
                return result;
            }
            catch (err) {
                console.error('Error creating audit request:', err);
                throw err;
            }
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['audit-requests'] });
            navigate('/beneficiary/my-requests');
        },
        onError: (err) => {
            console.error('Mutation error:', err);
        },
    });
    const validate = () => {
        const e = {};
        if (!formData.postal_code.trim())
            e.postal_code = 'Kod pocztowy jest wymagany';
        if (!formData.city.trim())
            e.city = 'Miasto jest wymagane';
        if (!formData.street_address.trim())
            e.street_address = 'Adres jest wymagany';
        if (!formData.phone_number.trim())
            e.phone_number = 'Telefon jest wymagany';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (validate())
            createRequest(formData);
    };
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Nowe Zlecenie Audytora", subtitle: "Zam\u00F3w audyt energetyczny" }), _jsxs(Section, { children: [error && _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 utworzy\u0107 zlecenia audytu." }), _jsx(Card, { children: _jsxs("form", { onSubmit: onSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), " Kod pocztowy"] }) }), _jsx("input", { type: "text", value: formData.postal_code, onChange: e => {
                                                        setFormData(prev => ({ ...prev, postal_code: e.target.value }));
                                                        setErrors(prev => ({ ...prev, postal_code: undefined }));
                                                    }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.postal_code ? 'border-red-500' : 'border-slate-300'}`, placeholder: "XX-XXX" }), errors.postal_code && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.postal_code })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Miasto" }), _jsx("input", { type: "text", value: formData.city, onChange: e => {
                                                        setFormData(prev => ({ ...prev, city: e.target.value }));
                                                        setErrors(prev => ({ ...prev, city: undefined }));
                                                    }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.city ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Nazwa miasta" }), errors.city && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.city })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Home, { className: "w-4 h-4" }), " Adres"] }) }), _jsx("input", { type: "text", value: formData.street_address, onChange: e => {
                                                setFormData(prev => ({ ...prev, street_address: e.target.value }));
                                                setErrors(prev => ({ ...prev, street_address: undefined }));
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.street_address ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Ulica i numer domu" }), errors.street_address && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.street_address })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4" }), " Telefon"] }) }), _jsx("input", { type: "tel", value: formData.phone_number, onChange: e => {
                                                setFormData(prev => ({ ...prev, phone_number: e.target.value }));
                                                setErrors(prev => ({ ...prev, phone_number: undefined }));
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.phone_number ? 'border-red-500' : 'border-slate-300'}`, placeholder: "XXX XXX XXX" }), errors.phone_number && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.phone_number })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "primary", disabled: isPending, className: "flex-1", children: isPending ? 'Tworzenie…' : 'Zamów audyt' }), _jsx(Button, { variant: "outline", onClick: () => navigate('/beneficiary/my-requests'), children: "Anuluj" })] })] }) })] })] }));
};
