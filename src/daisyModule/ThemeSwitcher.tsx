// src/daisyModule/ThemeSwitcher.tsx
import { useTheme } from './useTheme';

export default function ThemeSwitcher() {
  const { theme, toggle } = useTheme();
  return (
    <button className="btn" onClick={toggle}>
      Motyw: {theme === 'newyork' ? '🌆 NewYork' : '☀️ Light'}
    </button>
  );
}
