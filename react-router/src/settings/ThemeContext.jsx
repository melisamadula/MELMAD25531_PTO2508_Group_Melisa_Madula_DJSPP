import { createContext, useState, useEffect } from 'react';

/**
 * @typedef {Object} ThemeContextValue
 * @property {'light'|'dark'} theme - The active UI application display mode state string.
 * @property {function(): void} toggleTheme - Switches the application display theme state back and forth between light and dark modes.
 */

/** @type {React.Context<ThemeContextValue|undefined>} */
export const ThemeContext = createContext();

/**
 * Context Provider component that manages global interface styling configurations.
 * Synchronises states directly to structural DOM data-attributes and persistent localStorage buffers.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components requiring access to theme values.
 * @returns {JSX.Element} A context wrap element injecting the theme runtime scope properties.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
