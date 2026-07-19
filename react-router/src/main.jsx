/**
 * @file Application entry point.
 * Mounts the React application root onto the DOM element with the ID "root".
 * Establishes the core layout hierarchy by nesting required global providers:
 * - StrictMode: Activates runtime safety and warning checks.
 * - ThemeProvider: Manages global dark/light stylesheet parameters.
 * - BrowserRouter: Controls client-side view history and routing.
 * - AudioPlayerProvider: Supplies continuous persistent media playback contexts.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./settings/Theme.module.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./settings/ThemeContext.jsx";
import { AudioPlayerProvider } from "./context/AudioPlayerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AudioPlayerProvider>
          <App />
        </AudioPlayerProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
