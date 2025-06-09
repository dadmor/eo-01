import { jsx as _jsx } from "react/jsx-runtime";
import { BaseGrid } from './BaseGrid';
export const CardGrid = ({ children }) => (_jsx(BaseGrid, { colsMobile: 1, colsDesktop: 2, gap: "gap-6", children: children }));
