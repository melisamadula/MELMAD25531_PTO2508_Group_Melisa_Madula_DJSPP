import { useTheme } from "./useTheme";
import "./Theme.module.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? '🌑 Dark' : '☀️ Light'} Mode
    </button>
  );
};
