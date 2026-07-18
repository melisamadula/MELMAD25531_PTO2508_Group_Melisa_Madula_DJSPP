import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavoritesPage from "./components/Podcasts/FavoritesPage"; // 1. Import your new page
import { PodcastProvider } from "./context/PodcastContext";
import AppPlayer from "./components/AudioPlayer";

export default function App() {
  return (
    <PodcastProvider> {/* 2. Moved Provider to the absolute top of the tree */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/favorites" element={<FavoritesPage />} /> {/* 3. Registered route */}
      </Routes>
      <AppPlayer />
    </PodcastProvider>
  );
}
