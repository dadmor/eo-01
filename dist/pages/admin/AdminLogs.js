import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { supabase } from '@/utility';
import { useQuery } from '@tanstack/react-query';
export const AdminLogs = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['moderation_logs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('moderation_logs')
                .select('*, users!operator_id(name, email)');
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    });
    console.log('System logs:', data);
    // Loading state
    if (isLoading) {
        return (_jsx("div", { className: "container mx-auto p-6", children: _jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px]", children: [_jsx("span", { className: "loading loading-spinner loading-lg text-primary" }), _jsx("p", { className: "mt-4 text-lg", children: "\u0141adowanie log\u00F3w systemowych..." })] }) }));
    }
    // Error state
    if (error) {
        return (_jsx("div", { className: "container mx-auto p-6", children: _jsxs("div", { className: "alert alert-error", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "stroke-current shrink-0 h-6 w-6", fill: "none", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold", children: "B\u0142\u0105d \u0142adowania log\u00F3w!" }), _jsx("div", { className: "text-xs", children: error.message })] })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-base-content", children: "Logi Systemowe" }), _jsx("p", { className: "text-base-content/70 mt-2", children: "Historia dzia\u0142a\u0144 w systemie" })] }), _jsx("div", { className: "stats shadow mb-6", children: _jsxs("div", { className: "stat", children: [_jsx("div", { className: "stat-title", children: "\u0141\u0105czna liczba log\u00F3w" }), _jsx("div", { className: "stat-value text-primary", children: data?.length || 0 })] }) }), _jsx("div", { className: "space-y-4", children: data && data.length > 0 ? (data.map((log) => (_jsx("div", { className: "card bg-base-100 shadow-md border border-base-300", children: _jsx("div", { className: "card-body", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "card-title text-lg", children: [log.action, _jsx("div", { className: "badge badge-primary badge-sm ml-2", children: log.severity || 'INFO' })] }), _jsx("p", { className: "text-base-content/70 mt-2", children: log.description }), log.users && (_jsxs("div", { className: "flex items-center gap-2 mt-3", children: [_jsx("div", { className: "avatar placeholder", children: _jsx("div", { className: "bg-neutral text-neutral-content rounded-full w-8", children: _jsx("span", { className: "text-xs", children: log.users.name?.charAt(0) }) }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: log.users.name }), _jsx("p", { className: "text-xs text-base-content/50", children: log.users.email })] })] })), log.metadata && (_jsx("div", { className: "mt-3", children: _jsxs("details", { className: "collapse collapse-arrow bg-base-200", children: [_jsx("summary", { className: "collapse-title text-sm font-medium", children: "Szczeg\u00F3\u0142y techniczne" }), _jsx("div", { className: "collapse-content", children: _jsx("pre", { className: "text-xs bg-base-300 p-2 rounded mt-2 overflow-x-auto", children: JSON.stringify(log.metadata, null, 2) }) })] }) }))] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm font-medium text-base-content", children: new Date(log.created_at).toLocaleDateString('pl-PL') }), _jsx("div", { className: "text-xs text-base-content/50", children: new Date(log.created_at).toLocaleTimeString('pl-PL') })] })] }) }) }, log.id)))) : (_jsx("div", { className: "hero min-h-[200px]", children: _jsx("div", { className: "hero-content text-center", children: _jsxs("div", { children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "text-xl font-bold", children: "Brak log\u00F3w" }), _jsx("p", { className: "text-base-content/70", children: "Nie znaleziono \u017Cadnych log\u00F3w systemowych do wy\u015Bwietlenia" })] }) }) })) }), data && data.length > 10 && (_jsx("div", { className: "flex justify-center mt-8", children: _jsxs("div", { className: "join", children: [_jsx("button", { className: "join-item btn", children: "\u00AB" }), _jsx("button", { className: "join-item btn", children: "Strona 1" }), _jsx("button", { className: "join-item btn", children: "\u00BB" })] }) }))] }));
};
