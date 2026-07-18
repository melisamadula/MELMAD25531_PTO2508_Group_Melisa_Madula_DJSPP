import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
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
