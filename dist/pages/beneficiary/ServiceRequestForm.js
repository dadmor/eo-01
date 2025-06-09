import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/ServiceRequestForm.tsx
// ===================================================================
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Section, Hero, Card, Button, Alert, } from '@/components/ui/basic';
import { Home, MapPin, Phone } from 'lucide-react';
import { beneficiaryApi } from './api/beneficiaries';
export const ServiceRequestForm = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const beneficiaryId = 'current-beneficiary-id'; // TODO: get from auth
    const [formData, setFormData] = useState({
        postal_code: '',
        city: '',
        street_address: '',
        phone_number: '',
        heat_source: undefined,
        windows_count: undefined,
        doors_count: undefined,
        wall_insulation_m2: undefined,
        attic_insulation_m2: undefined,
    });
    const [errors, setErrors] = useState({});
    const { mutate: createRequest, isPending, error } = useMutation({
        mutationFn: (data) => beneficiaryApi.createServiceRequest({ ...data, beneficiary_id: beneficiaryId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['service-requests'] });
            navigate('/beneficiary/my-requests');
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
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Nowe Zlecenie Wykonawcy", subtitle: "Utw\u00F3rz zlecenie dla wykonawc\u00F3w" }), _jsxs(Section, { children: [error && _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 utworzy\u0107 zlecenia." }), _jsx(Card, { children: _jsxs("form", { onSubmit: onSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), " Kod pocztowy"] }) }), _jsx("input", { type: "text", value: formData.postal_code, onChange: e => {
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
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.phone_number ? 'border-red-500' : 'border-slate-300'}`, placeholder: "XXX XXX XXX" }), errors.phone_number && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.phone_number })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Parametry techniczne (opcjonalne)" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "\u0179r\u00F3d\u0142o ciep\u0142a" }), _jsxs("select", { value: formData.heat_source || '', onChange: e => setFormData(prev => ({
                                                                ...prev,
                                                                heat_source: e.target.value || undefined
                                                            })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", children: [_jsx("option", { value: "", children: "Wybierz..." }), _jsx("option", { value: "pompa_ciepla", children: "Pompa ciep\u0142a" }), _jsx("option", { value: "piec_pellet", children: "Piec na pellet" }), _jsx("option", { value: "piec_zgazowujacy", children: "Piec zgazowuj\u0105cy" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Liczba okien" }), _jsx("input", { type: "number", min: "0", value: formData.windows_count || '', onChange: e => setFormData(prev => ({
                                                                ...prev,
                                                                windows_count: e.target.value ? Number(e.target.value) : undefined
                                                            })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Liczba drzwi" }), _jsx("input", { type: "number", min: "0", value: formData.doors_count || '', onChange: e => setFormData(prev => ({
                                                                ...prev,
                                                                doors_count: e.target.value ? Number(e.target.value) : undefined
                                                            })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Izolacja \u015Bcian (m\u00B2)" }), _jsx("input", { type: "number", min: "0", value: formData.wall_insulation_m2 || '', onChange: e => setFormData(prev => ({
                                                                ...prev,
                                                                wall_insulation_m2: e.target.value ? Number(e.target.value) : undefined
                                                            })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Izolacja poddasza (m\u00B2)" }), _jsx("input", { type: "number", min: "0", value: formData.attic_insulation_m2 || '', onChange: e => setFormData(prev => ({
                                                                ...prev,
                                                                attic_insulation_m2: e.target.value ? Number(e.target.value) : undefined
                                                            })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", placeholder: "0" })] })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "primary", disabled: isPending, className: "flex-1", children: isPending ? 'Tworzenie…' : 'Utwórz zlecenie' }), _jsx(Button, { variant: "outline", onClick: () => navigate('/beneficiary/my-requests'), children: "Anuluj" })] })] }) })] })] }));
};
