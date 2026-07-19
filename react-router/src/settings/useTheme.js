import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

/**
 * Custom React hook to safely consume the global application theme state and controls.
 * Provides direct access to the current active theme mode and the toggle modifier function.
 *
 * @returns {import("./ThemeContext").ThemeContextValue} The compiled active theme configurations and control parameters.
 */
export const useTheme = () => useContext(ThemeContext);
