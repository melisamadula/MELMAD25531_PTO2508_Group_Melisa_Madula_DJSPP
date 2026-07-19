import { useTheme } from "./useTheme";
import styles from "./Theme.module.css";

/**
 * An interactive UI action button that alternates between styling modes.
 * Consumes custom context state abstractions to update active configurations, 
 * updating the interior text copy dynamically based on the active theme indicator.
 *
 * @component
 * @returns {JSX.Element} A controlled styling toggle action button element.
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggleButton} onClick={toggleTheme}>
      {theme === 'light' ? '🌑 Dark' : '☀️ Light'}
    </button>
  );
};
