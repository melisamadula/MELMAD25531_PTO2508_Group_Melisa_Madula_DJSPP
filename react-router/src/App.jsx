import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavoritesPage from "./components/Podcasts/FavoritesPage";
import { PodcastProvider } from "./context/PodcastContext";
import AppPlayer from "./components/AudioPlayer";

/**
 * Root structural layout component for the application.
 * 
 * Functions as the top-level boundary orchestrator; injecting global podcast context scopes, 
 * rendering fixed UI wrappers like the global Header and layout AppPlayer, and mounting 
 * matching client-side path structures for the page routing framework.
 *
 * @component
 * @returns {JSX.Element} The initialized core application layout tree.
 */
export default function App() {
  return (
    <PodcastProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
      <AppPlayer />
    </PodcastProvider>
  );
}
