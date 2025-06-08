import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { supabase } from "@/utility";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
export const AdminUsers = () => {
    const [page, setPage] = useState(0);
    const [roleFilter, setRoleFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 10;
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["users", page, roleFilter, searchTerm],
        queryFn: async () => {
            let query = supabase.from("users").select(`
          *,
          user_points(balance)
        `, { count: "exact" });
            // Filtrowanie po roli
            if (roleFilter) {
                query = query.eq("role", roleFilter);
            }
            // Wyszukiwanie po nazwie lub emailu
            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            }
            // Paginacja
            const from = page * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);
            const { data, error, count } = await query;
            if (error) {
                throw new Error(error.message);
            }
            return { users: data, totalCount: count };
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const users = data?.users || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    if (isLoading) {
        return (_jsxs("div", { className: "hero", children: [_jsx("h1", { className: "text-5xl", children: "Zarz\u0105dzanie U\u017Cytkownikami" }), _jsx("div", { className: "loading", children: "\u0141adowanie u\u017Cytkownik\u00F3w..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "hero", children: [_jsx("h1", { className: "text-5xl", children: "Zarz\u0105dzanie U\u017Cytkownikami" }), _jsxs("div", { className: "error", children: ["B\u0142\u0105d podczas \u0142adowania: ", error.message, _jsx("button", { onClick: () => refetch(), className: "btn-retry", children: "Spr\u00F3buj ponownie" })] })] }));
    }
    return (_jsxs("div", { className: "hero", children: [_jsx("h1", { className: "text-5xl", children: "Zarz\u0105dzanie U\u017Cytkownikami" }), _jsxs("div", { className: "controls", children: [_jsx("input", { type: "text", placeholder: "Szukaj po nazwie lub emailu...", value: searchTerm, onChange: (e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset do pierwszej strony
                        }, className: "search-input" }), _jsxs("select", { value: roleFilter, onChange: (e) => {
                            setRoleFilter(e.target.value);
                            setPage(0); // Reset do pierwszej strony
                        }, className: "role-filter", children: [_jsx("option", { value: "", children: "Wszystkie role" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "user", children: "U\u017Cytkownik" }), _jsx("option", { value: "moderator", children: "Moderator" })] })] }), _jsx("div", { className: "users-stats", children: _jsxs("p", { children: ["Wy\u015Bwietlono ", users.length, " z ", totalCount, " u\u017Cytkownik\u00F3w"] }) }), _jsx("div", { className: "users-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Nazwa" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Rola" }), _jsx("th", { children: "Telefon" }), _jsx("th", { children: "Miasto" }), _jsx("th", { children: "Punkty" }), _jsx("th", { children: "Data utworzenia" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { children: [_jsx("td", { children: user.name }), _jsx("td", { children: user.email }), _jsx("td", { children: user.role }), _jsx("td", { children: user.phone_number }), _jsx("td", { children: user.city }), _jsx("td", { children: user.user_points?.[0]?.balance || 0 }), _jsx("td", { children: new Date(user.created_at).toLocaleDateString("pl-PL") })] }, user.id))) })] }) }), _jsxs("div", { className: "pagination", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: page === 0, className: "pagination-btn", children: "Poprzednia" }), _jsxs("span", { className: "page-info", children: ["Strona ", page + 1, " z ", totalPages] }), _jsx("button", { onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)), disabled: page >= totalPages - 1, className: "pagination-btn", children: "Nast\u0119pna" })] })] }));
};
