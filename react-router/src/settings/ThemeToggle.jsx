import { useTheme } from "./useTheme";
import styles from "./Theme.module.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggleButton} onClick={toggleTheme}>
      {theme === 'light' ? '🌑 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};
