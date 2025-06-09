import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auth/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimpleForm } from '@/hooks/useSimpleForm';
import { supabase } from '@/utility';
import { Eye, EyeOff, Mail, Lock, UserPlus, Users, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";
import { Alert } from "@/components/ui/basic/Alert";
import { LoadingSpinner } from "@/components/ui/basic/LoadingSpinner";
export const Register = () => {
    const { getFormData } = useSimpleForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const { email: rawEmail, password: rawPassword, confirmPassword: rawConfirmPassword, role: rawRole } = getFormData(e.currentTarget);
        // Wyciągamy pierwszy element, jeśli to tablica
        const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
        const password = Array.isArray(rawPassword) ? rawPassword[0] : rawPassword;
        const confirmPassword = Array.isArray(rawConfirmPassword) ? rawConfirmPassword[0] : rawConfirmPassword;
        const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
        if (password !== confirmPassword) {
            setError('Hasła muszą być takie same');
            return;
        }
        if (password.length < 6) {
            setError('Hasło musi mieć co najmniej 6 znaków');
            return;
        }
        try {
            setLoading(true);
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: role || 'beneficiary'
                    },
                    emailRedirectTo: import.meta.env.VITE_SITE_URL + '/auth/callback' || `${window.location.origin}/auth/callback`
                }
            });
            if (signUpError)
                throw signUpError;
            setSuccess('Konto utworzone pomyślnie! Sprawdź swoją skrzynkę e-mail, aby potwierdzić rejestrację.');
        }
        catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Wystąpił błąd podczas rejestracji');
        }
        finally {
            setLoading(false);
        }
    };
    if (success) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs(Card, { className: "shadow-xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "w-8 h-8 text-green-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Rejestracja zako\u0144czona!" }), _jsx(Alert, { type: "success", title: "Sukces", message: success, className: "mb-6" }), _jsx(Button, { variant: "primary", size: "lg", onClick: () => navigate('/login'), fullWidth: true, children: "Przejd\u017A do logowania" })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs(Card, { className: "shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(UserPlus, { className: "w-8 h-8 text-blue-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Utw\u00F3rz konto" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Zarejestruj si\u0119, aby rozpocz\u0105\u0107" })] }), error && (_jsx("div", { className: "mb-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d rejestracji", message: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Adres e-mail *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", required: true, placeholder: "twoj@email.pl", disabled: loading, className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 mb-2", children: "Typ konta *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Users, { className: "h-5 w-5 text-gray-400" }) }), _jsxs("select", { id: "role", name: "role", required: true, disabled: loading, className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 appearance-none bg-white", children: [_jsx("option", { value: "", children: "Wybierz typ konta" }), _jsx("option", { value: "beneficiary", children: "Beneficjent" }), _jsx("option", { value: "auditor", children: "Audytor" })] }), _jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Beneficjent - osoba korzystaj\u0105ca z us\u0142ug, Audytor - osoba przeprowadzaj\u0105ca audyty" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Has\u0142o *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading, className: "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Minimum 6 znak\u00F3w" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-2", children: "Powt\u00F3rz has\u0142o *" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: showConfirmPassword ? "text" : "password", required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading, className: "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] })] }), _jsx(Button, { variant: "primary", size: "lg", disabled: loading, fullWidth: true, onClick: () => { }, icon: loading ? _jsx(LoadingSpinner, { size: "sm" }) : undefined, children: loading ? "Tworzenie konta..." : "Utwórz konto" })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-gray-600 text-sm", children: ["Masz ju\u017C konto?", " ", _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Zaloguj si\u0119" })] }) })] }) }) }));
};
