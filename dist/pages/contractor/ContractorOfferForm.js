import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/contractor/ContractorOfferForm.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Section, Hero, Card, Button, Alert, LoadingState } from '@/components/ui/basic';
import { DollarSign, FileText } from 'lucide-react';
import { contractorApi } from './api/contractors';
export const ContractorOfferForm = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [formData, setFormData] = useState({
        request_id: '',
        price: '',
        scope: '',
    });
    const [errors, setErrors] = useState({});
    const contractorId = 'current-contractor-id';
    const { data: serviceRequests = [], isLoading: loadingReq, error: reqError } = useQuery({
        queryKey: ['service-requests'],
        queryFn: contractorApi.getServiceRequests,
    });
    const { mutate: createOffer, isPending, error: offerError } = useMutation({
        mutationFn: (data) => contractorApi.createOffer(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['contractor-offers'] });
            navigate('/contractor/offers');
        },
    });
    const validate = () => {
        const e = {};
        if (!formData.request_id)
            e.request_id = 'Wybierz zlecenie';
        // Walidacja ceny - sprawdzamy czy można przekonwertować na liczbę
        const priceNum = parseFloat(formData.price);
        if (!formData.price.trim() || isNaN(priceNum) || priceNum <= 0) {
            e.price = 'Podaj poprawną cenę';
        }
        if (!formData.scope.trim())
            e.scope = 'Opisz zakres prac';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Konwertujemy cenę na number dopiero przy wysyłaniu
            createOffer({
                ...formData,
                price: parseFloat(formData.price),
                contractor_id: contractorId
            });
        }
    };
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Nowa Oferta", subtitle: "Z\u0142\u00F3\u017C ofert\u0119 na wybrane zlecenie" }), _jsxs(Section, { children: [offerError && _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 z\u0142o\u017Cy\u0107 oferty." }), loadingReq ? (_jsx(LoadingState, { size: "lg" })) : (_jsx(Card, { children: _jsxs("form", { onSubmit: onSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Zlecenie" }), _jsxs("select", { value: formData.request_id, onChange: e => {
                                                setFormData(prev => ({ ...prev, request_id: e.target.value }));
                                                setErrors(prev => ({ ...prev, request_id: undefined }));
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.request_id ? 'border-red-500' : 'border-slate-300'}`, children: [_jsx("option", { value: "", children: "Wybierz zlecenie..." }), serviceRequests.map(r => (_jsx("option", { value: r.id, children: r.title || r.id }, r.id)))] }), errors.request_id && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.request_id })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-4 h-4" }), " Cena (PLN)"] }) }), _jsx("input", { type: "number", min: "0", step: "0.01", value: formData.price, onChange: e => {
                                                setFormData(prev => ({ ...prev, price: e.target.value }));
                                                setErrors(prev => ({ ...prev, price: undefined }));
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.price ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Wprowad\u017A cen\u0119..." }), errors.price && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.price })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "w-4 h-4" }), " Zakres prac"] }) }), _jsx("textarea", { rows: 6, value: formData.scope, onChange: e => {
                                                setFormData(prev => ({ ...prev, scope: e.target.value }));
                                                setErrors(prev => ({ ...prev, scope: undefined }));
                                            }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 resize-none ${errors.scope ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Opisz zakres prac..." }), errors.scope && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.scope })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "primary", disabled: isPending, className: "flex-1", children: isPending ? 'Wysyłanie…' : 'Złóż ofertę' }), _jsx(Button, { variant: "outline", onClick: () => navigate('/contractor/marketplace'), children: "Anuluj" })] })] }) }))] })] }));
};
