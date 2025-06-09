import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, LoadingSpinner, Alert } from '../../components/ui/basic';
import { FormField, FormInput, FormTextarea } from '../../components/ui/form';
import { User, Award, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { auditorApi } from './api/auditors';
import { useAuth } from '@/hooks/useAuth'; // Dodano import
export const AuditorPortfolio = () => {
    const { user, delegatedUser } = useAuth(); // Dodano hook useAuth
    // Użyj delegatedUser jeśli istnieje, w przeciwnym razie user
    const currentUser = delegatedUser || user;
    const auditorId = currentUser?.id;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name_or_company: '',
        certificate_data: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    // Sprawdzenie czy użytkownik jest zalogowany
    if (!currentUser || !auditorId) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie mo\u017Cna za\u0142adowa\u0107 danych u\u017Cytkownika. Zaloguj si\u0119 ponownie." }) }));
    }
    const { data: portfolioItems = [], isLoading, error, refetch } = useQuery({
        queryKey: ['auditor-portfolios', auditorId],
        queryFn: auditorApi.getAuditorPortfolios,
    });
    const createPortfolioMutation = useMutation({
        mutationFn: (portfolioData) => auditorApi.createAuditorPortfolio(portfolioData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
            resetForm();
        },
        onError: (error) => {
            console.error('Error creating portfolio item:', error);
        }
    });
    const updatePortfolioMutation = useMutation({
        mutationFn: ({ id, data }) => auditorApi.updateAuditorPortfolio(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
            resetForm();
        },
        onError: (error) => {
            console.error('Error updating portfolio item:', error);
        }
    });
    const deletePortfolioMutation = useMutation({
        mutationFn: (id) => auditorApi.deleteAuditorPortfolio(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
        },
        onError: (error) => {
            console.error('Error deleting portfolio item:', error);
        }
    });
    const resetForm = () => {
        setFormData({
            name_or_company: '',
            certificate_data: '',
            description: ''
        });
        setErrors({});
        setIsFormOpen(false);
        setEditingItem(null);
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name_or_company.trim()) {
            newErrors.name_or_company = 'Nazwa lub firma jest wymagana';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Opis jest wymagany';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const portfolioData = {
            auditor_id: auditorId,
            name_or_company: formData.name_or_company.trim(),
            certificate_data: formData.certificate_data.trim(),
            description: formData.description.trim()
        };
        if (editingItem) {
            updatePortfolioMutation.mutate({ id: editingItem.id, data: portfolioData });
        }
        else {
            createPortfolioMutation.mutate(portfolioData);
        }
    };
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name_or_company: item.name_or_company || '',
            certificate_data: item.certificate_data || '',
            description: item.description || ''
        });
        setIsFormOpen(true);
    };
    const handleDelete = (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten element portfolio?')) {
            deletePortfolioMutation.mutate(id);
        }
    };
    const isPending = createPortfolioMutation.isPending || updatePortfolioMutation.isPending;
    const hasError = createPortfolioMutation.isError || updatePortfolioMutation.isError;
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 portfolio", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Portfolio Audytora" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Zarz\u0105dzaj swoim do\u015Bwiadczeniem i certyfikatami" })] }), _jsxs(Button, { variant: "primary", onClick: () => setIsFormOpen(true), className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Dodaj pozycj\u0119"] })] }), hasError && (_jsx(Alert, { type: "error", title: "B\u0142\u0105d", message: "Nie uda\u0142o si\u0119 zapisa\u0107 zmian. Spr\u00F3buj ponownie." })), (createPortfolioMutation.isSuccess || updatePortfolioMutation.isSuccess) && (_jsx(Alert, { type: "success", title: "Sukces", message: editingItem ? "Portfolio zostało zaktualizowane!" : "Nowa pozycja została dodana do portfolio!" })), isFormOpen && (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900", children: editingItem ? 'Edytuj pozycję' : 'Dodaj nową pozycję' }), _jsx(Button, { variant: "outline", onClick: resetForm, children: "Anuluj" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(FormField, { label: "Nazwa lub firma", error: errors.name_or_company, required: true, children: _jsx(FormInput, { value: formData.name_or_company, onChange: (e) => handleInputChange('name_or_company', e.target.value), placeholder: "np. Certyfikowany Audytor Energetyczny", icon: _jsx(User, { className: "w-4 h-4" }) }) }), _jsx(FormField, { label: "Certyfikaty i uprawnienia", error: errors.certificate_data, children: _jsx(FormTextarea, { value: formData.certificate_data, onChange: (e) => handleInputChange('certificate_data', e.target.value), placeholder: "Opisz swoje certyfikaty, uprawnienia, licencje...", rows: 3 }) }), _jsx(FormField, { label: "Opis do\u015Bwiadczenia", error: errors.description, required: true, children: _jsx(FormTextarea, { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "Opisz swoje do\u015Bwiadczenie, realizowane projekty, specjalizacje...", rows: 4 }) }), _jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { variant: "primary", disabled: isPending, className: "flex items-center gap-2", children: [isPending ? (_jsx(LoadingSpinner, { size: "sm" })) : editingItem ? (_jsx(Edit, { className: "w-4 h-4" })) : (_jsx(Plus, { className: "w-4 h-4" })), isPending ? 'Zapisywanie...' : editingItem ? 'Zaktualizuj' : 'Dodaj pozycję'] }), _jsx(Button, { variant: "outline", onClick: resetForm, children: "Anuluj" })] })] })] }) })), _jsx("div", { className: "grid grid-cols-1 gap-6", children: portfolioItems.map((item) => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(User, { className: "w-5 h-5 text-slate-500" }), _jsx("h3", { className: "text-lg font-semibold text-slate-900", children: item.name_or_company })] }), item.certificate_data && (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Award, { className: "w-4 h-4 text-slate-500" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: "Certyfikaty:" })] }), _jsx("p", { className: "text-slate-600 text-sm pl-6", children: item.certificate_data })] })), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(FileText, { className: "w-4 h-4 text-slate-500" }), _jsx("span", { className: "text-sm font-medium text-slate-700", children: "Opis:" })] }), _jsx("p", { className: "text-slate-600 text-sm pl-6", children: item.description })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleEdit(item), children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleDelete(item.id), disabled: deletePortfolioMutation.isPending, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "text-xs text-slate-500", children: ["Dodano: ", new Date(item.created_at).toLocaleDateString('pl'), item.updated_at && item.updated_at !== item.created_at && (_jsxs("span", { className: "ml-2", children: ["\u2022 Zaktualizowano: ", new Date(item.updated_at).toLocaleDateString('pl')] }))] })] }) }, item.id))) }), portfolioItems.length === 0 && !isFormOpen && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(User, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak pozycji w portfolio" }), _jsx("p", { className: "text-slate-600 mb-4", children: "Dodaj swoje do\u015Bwiadczenie, certyfikaty i kompetencje." }), _jsxs(Button, { variant: "primary", onClick: () => setIsFormOpen(true), className: "flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Dodaj pierwsz\u0105 pozycj\u0119"] })] }) }))] }));
};
