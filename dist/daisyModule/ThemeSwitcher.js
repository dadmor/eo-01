import { jsxs as _jsxs } from "react/jsx-runtime";
// src/daisyModule/ThemeSwitcher.tsx
import { useTheme } from './useTheme';
export default function ThemeSwitcher() {
    const { theme, toggle } = useTheme();
    return (_jsxs("button", { className: "btn", onClick: toggle, children: ["Motyw: ", theme === 'newyork' ? '🌆 NewYork' : '☀️ Light'] }));
}
