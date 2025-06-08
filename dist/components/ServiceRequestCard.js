import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin, Clock, User } from 'lucide-react';
import { Card, Button } from './ui/basic';
const getDisplayName = (user) => {
    if (!user)
        return 'Anonimowy';
    const { first_name, last_name, email } = user;
    if (first_name && last_name)
        return `${first_name} ${last_name}`;
    if (first_name)
        return first_name;
    if (last_name)
        return last_name;
    return email.split('@')[0];
};
export const ServiceRequestCard = ({ request, onOffer, onDetails }) => (_jsx(Card, { children: _jsxs("div", { className: "p-6 flex flex-col h-full", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: request.title || 'Zlecenie bez tytułu' }), _jsx("p", { className: "text-slate-600 text-sm mb-4 line-clamp-2", children: request.description || 'Brak opisu' }), _jsx("div", { className: "flex-1" }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-500 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { children: request.city || 'Nie podano' })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { children: getDisplayName(request.users) })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsx("span", { children: new Date(request.created_at).toLocaleDateString('pl') })] })] }), _jsxs("div", { className: "flex gap-2 mt-auto", children: [_jsx(Button, { variant: "primary", className: "flex-1", onClick: () => onOffer(request.id), children: "Z\u0142\u00F3\u017C ofert\u0119" }), _jsx(Button, { variant: "outline", onClick: () => onDetails(request.id), children: "Szczeg\u00F3\u0142y" })] })] }) }));
