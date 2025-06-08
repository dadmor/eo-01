import { jsx as _jsx } from "react/jsx-runtime";
import { StatCard } from './basic/StatCard';
export const StatsGrid = ({ items, colsMobile = 1, colsDesktop = 3 }) => (_jsx("div", { className: `grid gap-6 grid-cols-${colsMobile} md:grid-cols-${colsDesktop}`, children: items.map((cfg, i) => (_jsx(StatCard, { ...cfg }, i))) }));
