import { jsx as _jsx } from "react/jsx-runtime";
export const BaseGrid = ({ children, colsMobile = 1, colsDesktop = 3, gap = 'gap-6' }) => (_jsx("div", { className: `grid ${gap} grid-cols-${colsMobile} md:grid-cols-${colsDesktop}`, children: children }));
