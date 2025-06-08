import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSimpleForm } from "@/hooks/useSimpleForm";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/basic/Card";
import { Button } from "@/components/ui/basic/Button";
import { Alert } from "@/components/ui/basic/Alert";
import { LoadingSpinner } from "@/components/ui/basic/LoadingSpinner";
import { LoginSuccessStep } from "./LoginSuccessStep";
export const Login = () => {
    const { getFormData } = useSimpleForm();
    const { login, user, loading: authLoading, resendConfirmationEmail } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastEmail, setLastEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    // Funkcja do określenia ścieżki dashboardu na podstawie roli
    const getDashboardPath = (role) => {
        switch (role) {
            case "admin":
                return "/admin/dashboard";
            case "contractor":
                return "/dashboard";
            case "auditor":
                return "/auditor/marketplace";
            default:
                return "/";
        }
    };
    useEffect(() => {
        if (user && !loginSuccess) {
            setLoginSuccess(true);
            // Nie przekierowujemy automatycznie - pokazujemy komunikat sukcesu
        }
    }, [user, loginSuccess]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setShowResend(false);
        setResendSuccess(false);
        setLoginSuccess(false);
        const { email: rawEmail, password: rawPassword } = getFormData(e.currentTarget);
        const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
        const password = Array.isArray(rawPassword) ? rawPassword[0] : rawPassword;
        setLastEmail(email);
        try {
            setLoading(true);
            await login(email, password);
        }
        catch (err) {
            console.error("Login error:", err);
            const msg = err.message || "Coś poszło nie tak przy logowaniu";
            setError(msg);
            if (err.status === 400 ||
                /not confirmed/i.test(msg) ||
                /potwierdzony/i.test(msg)) {
                setShowResend(true);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleResend = async () => {
        setResendLoading(true);
        setResendSuccess(false);
        try {
            await resendConfirmationEmail(lastEmail);
            setResendSuccess(true);
        }
        catch (err) {
            console.error("Resend error:", err);
            setError("Nie udało się wysłać maila ponownie");
        }
        finally {
            setResendLoading(false);
        }
    };
    const handleGoToDashboard = () => {
        if (user) {
            navigate(getDashboardPath(user.role));
        }
    };
    const handleBackToLogin = () => {
        setLoginSuccess(false);
        // Opcjonalnie można wylogować użytkownika
    };
    // Jeśli użytkownik jest zalogowany i loginSuccess jest true, pokaż komunikat sukcesu
    if (user && loginSuccess) {
        return (_jsx(LoginSuccessStep, { user: user, onGoToDashboard: handleGoToDashboard, onBackToLogin: handleBackToLogin }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs(Card, { className: "shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Lock, { className: "w-8 h-8 text-blue-600" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Witaj ponownie" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Zaloguj si\u0119 do swojego konta" })] }), error && (_jsxs("div", { className: "mb-6", children: [_jsx(Alert, { type: "error", title: "B\u0142\u0105d logowania", message: error }), showResend && (_jsxs("div", { className: "mt-4 space-y-3", children: [resendSuccess && (_jsx(Card, { className: "border-green-200 bg-green-50 p-3", children: _jsxs("div", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-500 mr-2" }), _jsx("span", { className: "text-green-800 text-sm", children: "Mail potwierdzaj\u0105cy zosta\u0142 wys\u0142any ponownie." })] }) })), _jsx(Button, { variant: "outline", size: "md", onClick: handleResend, disabled: resendLoading, fullWidth: true, icon: resendLoading ? _jsx(LoadingSpinner, { size: "sm" }) : undefined, children: resendLoading ? "Wysyłanie..." : "Wyślij ponownie e-mail potwierdzający" })] }))] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Adres e-mail" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", required: true, placeholder: "twoj@email.pl", disabled: authLoading || loading, className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Has\u0142o" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { id: "password", name: "password", type: showPassword ? "text" : "password", required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: authLoading || loading, className: "w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] })] }), _jsx(Button, { variant: "primary", size: "lg", disabled: authLoading || loading, fullWidth: true, onClick: () => { }, icon: loading ? _jsx(LoadingSpinner, { size: "sm" }) : undefined, children: loading ? "Logowanie..." : "Zaloguj się" })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-gray-600 text-sm", children: ["Nie masz konta?", " ", _jsx(Link, { to: "/register", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Zarejestruj si\u0119" })] }) })] }) }) }));
};
