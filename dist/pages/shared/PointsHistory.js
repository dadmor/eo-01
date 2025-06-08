import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/PointsHistory.jsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utility";
export const PointsHistory = () => {
    const { data: transactions = [], error, isLoading, } = useQuery({
        queryKey: ["points_transactions"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("points_transactions")
                .select("*");
            if (error)
                throw new Error(error.message);
            return data;
        },
        staleTime: 60_000,
        retry: false,
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("span", { className: "loading loading-spinner text-primary" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "alert alert-error shadow-lg", children: _jsx("div", { children: _jsxs("span", { children: ["B\u0142\u0105d: ", error.message] }) }) }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-5xl mb-6", children: "Historia Punkt\u00F3w" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "User ID" }), _jsx("th", { children: "Balance" }), _jsx("th", { children: "Data Aktualizacji" })] }) }), _jsx("tbody", { children: transactions.map((tx) => (_jsxs("tr", { children: [_jsx("td", { children: tx.id }), _jsx("td", { children: tx.user_id }), _jsx("td", { children: tx.balance }), _jsx("td", { children: new Date(tx.updated_at).toLocaleString("pl-PL", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) })] }, tx.id))) })] }) })] }));
};
