import { useEffect, useState } from 'react';
export function useTheme() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'newyork');
    useEffect(() => {
        // Ustaw motyw na <html>
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        // Debug: logi
        console.log('[useTheme] Zastosowano motyw:', theme);
        console.log('[useTheme] <html data-theme=>', document.documentElement.getAttribute('data-theme'));
        // Pobierz i pokaż wartości CSS
        const styles = getComputedStyle(document.documentElement);
        console.log('[useTheme] --p (primary):', styles.getPropertyValue('--p'));
        console.log('[useTheme] --b1 (base-100):', styles.getPropertyValue('--b1'));
    }, [theme]);
    const toggle = () => {
        const newTheme = theme === 'newyork' ? 'light' : 'newyork';
        console.log('[useTheme] Zmieniam motyw na:', newTheme);
        setTheme(newTheme);
    };
    return { theme, toggle };
}
