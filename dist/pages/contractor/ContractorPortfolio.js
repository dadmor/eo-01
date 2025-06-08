import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/contractor/ContractorPortfolio.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Section, Hero, Card, Button, Alert, LoadingState, InfoField } from '@/components/ui/basic';
import { FileText, Edit, Save, X } from 'lucide-react';
import { contractorApi } from './api/contractors';
export const ContractorPortfolio = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const contractorId = 'current-contractor-id';
    const { data: port, isLoading, error, refetch } = useQuery({
        queryKey: ['contractor-portfolio', contractorId],
        queryFn: () => contractorApi.getPortfolio(contractorId),
    });
    const { mutate: save, isPending } = useMutation({
        mutationFn: (data) => port?.id
            ? contractorApi.updatePortfolio(port.id, data)
            : contractorApi.createPortfolio({ contractor_id: contractorId, ...data }),
        onSuccess: () => {
            // Poprawione wywołanie invalidateQueries:
            qc.invalidateQueries({ queryKey: ['contractor-portfolio'] });
            setEditing(false);
        },
    });
    if (isLoading)
        return _jsx(LoadingState, { size: "lg" });
    if (error) {
        return (_jsx(Container, { children: _jsx(Section, { children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 portfolio.", onRetry: () => refetch() }) }) }));
    }
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Portfolio Wykonawcy", subtitle: "Zarz\u0105dzaj informacjami o firmie" }), _jsxs(Section, { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Informacje o firmie" }), !editing && (_jsx(Button, { variant: "primary", icon: _jsx(Edit, {}), onClick: () => {
                                    setForm({
                                        company_name: port?.company_name,
                                        nip: port?.nip,
                                        company_address: port?.company_address,
                                        description: port?.description,
                                    });
                                    setEditing(true);
                                }, children: "Edytuj" }))] }), _jsx(Card, { children: _jsx("div", { className: "p-6", children: editing ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Nazwa firmy" }), _jsx("input", { type: "text", value: form.company_name || '', onChange: e => setForm(prev => ({ ...prev, company_name: e.target.value })), className: "w-full px-3 py-2 border rounded-md focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "NIP" }), _jsx("input", { type: "text", value: form.nip || '', onChange: e => setForm(prev => ({ ...prev, nip: e.target.value })), className: "w-full px-3 py-2 border rounded-md focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Adres firmy" }), _jsx("input", { type: "text", value: form.company_address || '', onChange: e => setForm(prev => ({ ...prev, company_address: e.target.value })), className: "w-full px-3 py-2\tborder rounded-md focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Opis firmy" }), _jsx("textarea", { rows: 4, value: form.description || '', onChange: e => setForm(prev => ({ ...prev, description: e.target.value })), className: "w-full px-3 py-2 border rounded-md focus:outline-none resize-none" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { variant: "primary", icon: _jsx(Save, {}), disabled: isPending, onClick: () => save(form), children: isPending ? 'Zapisywanie…' : 'Zapisz' }), _jsx(Button, { variant: "outline", icon: _jsx(X, {}), onClick: () => setEditing(false), children: "Anuluj" })] })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(InfoField, { label: "Nazwa firmy", value: port?.company_name || '–' }), _jsx(InfoField, { label: "NIP", value: port?.nip || '–' }), _jsx(InfoField, { label: "Adres firmy", value: port?.company_address || '–' }), _jsx("div", { className: "md:col-span-2", children: _jsx(InfoField, { label: "Opis firmy", value: port?.description || '–' }) })] })) }) }), port?.contractor_gallery?.length ? (_jsxs(Section, { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(FileText, { className: "w-5 h-5 text-green-600" }), _jsx("h2", { className: "text-lg font-semibold", children: "Galeria prac" })] }), _jsx(Card, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6", children: port.contractor_gallery.map(item => (_jsxs("div", { className: "bg-slate-50 rounded-lg p-4", children: [item.image_url ? (_jsx("img", { src: item.image_url, alt: item.description, className: "w-full h-32 object-cover rounded-md mb-2" })) : (_jsx("div", { className: "w-full h-32 bg-slate-200 rounded-md flex items-center justify-center mb-2", children: _jsx(FileText, { className: "w-8 h-8 text-slate-400" }) })), item.description && _jsx("p", { className: "text-sm text-slate-600", children: item.description })] }, item.id))) }) })] })) : null] })] }));
};
