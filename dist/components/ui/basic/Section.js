import { jsx as _jsx } from "react/jsx-runtime";
export const Section = ({ children, bg = '' }) => (_jsx("section", { className: `py-6 ${bg}`, children: children }));
