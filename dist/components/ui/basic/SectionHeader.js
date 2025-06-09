import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../basic/Button';
import { Hero } from './Hero';
export const SectionHeader = ({ title, subtitle, actionLabel, onAction, actionIcon, actionVariant = 'primary' }) => (_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx(Hero, { title: title, subtitle: subtitle }), actionLabel && onAction && (_jsx(Button, { variant: actionVariant, icon: actionIcon, onClick: onAction, children: actionLabel }))] }));
