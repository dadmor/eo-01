import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../basic";
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange, }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return (_jsxs("div", { className: "flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-700", children: [_jsx("span", { children: "Wy\u015Bwietl:" }), _jsx("select", { value: itemsPerPage, onChange: (e) => onItemsPerPageChange(Number(e.target.value)), className: "border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500", children: [5, 10, 25, 50].map((n) => (_jsx("option", { value: n, children: n }, n))) }), _jsxs("span", { children: ["z ", totalItems, " wynik\u00F3w"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm text-slate-700", children: [startItem, "-", endItem, " z ", totalItems] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage - 1), disabled: currentPage === 1, children: "Poprzednia" }), [...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)) {
                                    return (_jsx(Button, { variant: page === currentPage ? "primary" : "outline", size: "sm", onClick: () => onPageChange(page), children: page }, page));
                                }
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (_jsx("span", { className: "px-2 text-slate-400", children: "..." }, page));
                                }
                                return null;
                            }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage + 1), disabled: currentPage === totalPages, children: "Nast\u0119pna" })] })] })] }));
};
export default Pagination;
