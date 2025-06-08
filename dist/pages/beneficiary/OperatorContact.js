import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ===================================================================
// src/pages/beneficiary/OperatorContact.tsx
// ===================================================================
import { Hero, Alert, Card, Button, Container, Section } from "@/components/ui/basic";
import { Clock, FileText, Phone } from "lucide-react";
import { useState } from "react";
export const OperatorContact = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const validate = () => {
        const e = {};
        if (!formData.subject.trim())
            e.subject = 'Temat jest wymagany';
        if (!formData.message.trim())
            e.message = 'Wiadomość jest wymagana';
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // TODO: Implement actual contact submission
            console.log('Wysyłanie wiadomości:', formData);
            setIsSubmitted(true);
            setFormData({ subject: '', message: '', priority: 'medium' });
        }
    };
    return (_jsxs(Container, { children: [_jsx(Hero, { title: "Kontakt z Operatorem", subtitle: "Skontaktuj si\u0119 z naszym zespo\u0142em wsparcia" }), _jsxs(Section, { children: [isSubmitted && (_jsx(Alert, { type: "success", title: "Wiadomo\u015B\u0107 wys\u0142ana", message: "Twoja wiadomo\u015B\u0107 zosta\u0142a wys\u0142ana. Skontaktujemy si\u0119 z Tob\u0105 wkr\u00F3tce." })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(Card, { children: _jsxs("form", { onSubmit: onSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Temat" }), _jsx("input", { type: "text", value: formData.subject, onChange: e => {
                                                            setFormData(prev => ({ ...prev, subject: e.target.value }));
                                                            setErrors(prev => ({ ...prev, subject: undefined }));
                                                        }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 ${errors.subject ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Kr\u00F3tko opisz problem lub pytanie" }), errors.subject && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.subject })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Priorytet" }), _jsxs("select", { value: formData.priority, onChange: e => setFormData(prev => ({
                                                            ...prev,
                                                            priority: e.target.value
                                                        })), className: "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2", children: [_jsx("option", { value: "low", children: "Niski" }), _jsx("option", { value: "medium", children: "\u015Aredni" }), _jsx("option", { value: "high", children: "Wysoki" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Wiadomo\u015B\u0107" }), _jsx("textarea", { rows: 8, value: formData.message, onChange: e => {
                                                            setFormData(prev => ({ ...prev, message: e.target.value }));
                                                            setErrors(prev => ({ ...prev, message: undefined }));
                                                        }, className: `w-full px-3 py-2 border rounded-md focus:ring-2 resize-none ${errors.message ? 'border-red-500' : 'border-slate-300'}`, placeholder: "Opisz szczeg\u00F3\u0142owo swoje pytanie lub problem..." }), errors.message && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.message })] }), _jsx(Button, { variant: "primary", className: "w-full", children: "Wy\u015Blij wiadomo\u015B\u0107" })] }) }) }), _jsxs("div", { children: [_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Informacje kontaktowe" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Phone, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: "Telefon" })] }), _jsx("p", { className: "text-slate-600", children: "+48 800 123 456" }), _jsx("p", { className: "text-sm text-slate-500", children: "Pon-Pt 8:00-16:00" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(FileText, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: "Email" })] }), _jsx("p", { className: "text-slate-600", children: "pomoc@e-operator.pl" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Clock, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: "Czas odpowiedzi" })] }), _jsx("p", { className: "text-slate-600", children: "Do 24 godzin" })] })] })] }) }), _jsx(Card, { className: "mt-6", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Najcz\u0119stsze pytania" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("details", { className: "group", children: [_jsx("summary", { className: "cursor-pointer font-medium", children: "Jak d\u0142ugo trwa weryfikacja zlecenia?" }), _jsx("p", { className: "text-sm text-slate-600 mt-2", children: "Weryfikacja zlecenia zwykle trwa 1-2 dni robocze." })] }), _jsxs("details", { className: "group", children: [_jsx("summary", { className: "cursor-pointer font-medium", children: "Czy mog\u0119 anulowa\u0107 zlecenie?" }), _jsx("p", { className: "text-sm text-slate-600 mt-2", children: "Tak, zlecenia mo\u017Cna anulowa\u0107 przed ich weryfikacj\u0105." })] }), _jsxs("details", { className: "group", children: [_jsx("summary", { className: "cursor-pointer font-medium", children: "Jak wybra\u0107 najlepsz\u0105 ofert\u0119?" }), _jsx("p", { className: "text-sm text-slate-600 mt-2", children: "Por\u00F3wnaj ceny, zakres prac i opinie innych klient\u00F3w." })] })] })] }) })] })] })] })] }));
};
