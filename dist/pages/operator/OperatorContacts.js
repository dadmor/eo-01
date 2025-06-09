import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/operator/OperatorContacts.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, LoadingSpinner, Alert, StatCard, } from "../../components/ui/basic";
import { SearchFilter, SelectFilter } from "../../components/ui/form";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { operatorApi } from "./api/operator";
const roleLabels = {
    beneficiary: "Beneficjent",
    contractor: "Wykonawca",
    auditor: "Audytor",
    operator: "Operator",
    admin: "Administrator",
};
const roleColors = {
    beneficiary: "blue",
    contractor: "green",
    auditor: "purple",
    operator: "orange",
    admin: "red",
};
export const OperatorContacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const { data: contacts = [], isLoading, error, refetch, } = useQuery({
        queryKey: ["operator-contacts"],
        queryFn: operatorApi.getUserContacts,
    });
    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch = !searchTerm ||
            contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone_number?.includes(searchTerm);
        const matchesRole = !roleFilter || contact.role === roleFilter;
        const matchesLocation = !locationFilter ||
            contact.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            contact.postal_code?.includes(locationFilter);
        return matchesSearch && matchesRole && matchesLocation;
    });
    const stats = {
        total: contacts.length,
        beneficiaries: contacts.filter((c) => c.role === "beneficiary").length,
        contractors: contacts.filter((c) => c.role === "contractor").length,
        auditors: contacts.filter((c) => c.role === "auditor").length,
    };
    if (isLoading) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "flex items-center justify-center min-h-96", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6", children: _jsx(Alert, { type: "error", title: "B\u0142\u0105d \u0142adowania", message: "Nie uda\u0142o si\u0119 za\u0142adowa\u0107 kontakt\u00F3w u\u017Cytkownik\u00F3w", onRetry: () => refetch() }) }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Kontakty U\u017Cytkownik\u00F3w" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Przegl\u0105daj i zarz\u0105dzaj kontaktami wszystkich u\u017Cytkownik\u00F3w" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(StatCard, { icon: _jsx(User, { className: "w-5 h-5" }), title: "Wszyscy", value: stats.total, subtitle: "u\u017Cytkownik\u00F3w", color: "blue" }), _jsx(StatCard, { icon: _jsx(User, { className: "w-5 h-5" }), title: "Beneficjenci", value: stats.beneficiaries, subtitle: "zarejestrowanych", color: "green" }), _jsx(StatCard, { icon: _jsx(User, { className: "w-5 h-5" }), title: "Wykonawcy", value: stats.contractors, subtitle: "aktywnych", color: "purple" }), _jsx(StatCard, { icon: _jsx(User, { className: "w-5 h-5" }), title: "Audytorzy", value: stats.auditors, subtitle: "certyfikowanych" })] }), _jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Filtry" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(SearchFilter, { value: searchTerm, onChange: setSearchTerm, placeholder: "Szukaj po nazwie, email lub telefonie..." }), _jsx(SelectFilter, { options: [
                                        { value: "beneficiary", label: "Beneficjenci" },
                                        { value: "contractor", label: "Wykonawcy" },
                                        { value: "auditor", label: "Audytorzy" },
                                        { value: "operator", label: "Operatorzy" },
                                        { value: "admin", label: "Administratorzy" },
                                    ], value: roleFilter, onChange: (value) => setRoleFilter(value), placeholder: "Rola" }), _jsx(SelectFilter, { options: Array.from(new Set(contacts.map((contact) => contact.city).filter(Boolean))).map((city) => ({ value: city, label: city })), value: locationFilter, onChange: (value) => setLocationFilter(value), placeholder: "Miasto" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredContacts.map((contact) => (_jsx(Card, { children: _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex justify-between items-start mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900", children: contact.name || "Nie podano" }), "TODO -BADGE"] }), _jsxs("div", { className: "space-y-2 text-sm text-slate-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4" }), _jsx("span", { children: contact.email })] }), contact.phone_number && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { children: contact.phone_number })] })), contact.city && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [contact.city, " ", contact.postal_code] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["Do\u0142\u0105czy\u0142:", " ", new Date(contact.created_at).toLocaleDateString("pl")] })] })] })] }) }), _jsxs("div", { className: "flex gap-2 pt-4 border-t", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.open(`mailto:${contact.email}`), className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4" }), "Email"] }), contact.phone_number && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.open(`tel:${contact.phone_number}`), className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4" }), "Telefon"] }))] })] }) }, contact.id))) }), filteredContacts.length === 0 && (_jsx(Card, { children: _jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(User, { className: "w-8 h-8 text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Brak kontakt\u00F3w" }), _jsx("p", { className: "text-slate-600", children: "Nie znaleziono kontakt\u00F3w spe\u0142niaj\u0105cych wybrane kryteria." })] }) }))] }));
};
