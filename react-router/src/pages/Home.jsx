import {
  SearchBar,
  SortSelect,
  GenreFilter,
  PodcastGrid,
  Pagination,
  Loading,
  Error,
} from "../components";
import styles from "./Home.module.css";
import { genres } from "../data";
import { PodcastContext } from "../context/PodcastContext";
import { useContext } from "react";
import Carousel from "../settings/carousel.jsx";
import PodcastCard from "../components/Podcasts/PodcastCard";

/**
 * Home page of the Podcast Explorer app.
 *
 * - Displays the main podcast browsing interface.
 * - Includes search, genre filter, and sort controls.
 * - Shows a loading indicator or error message based on fetch state.
 * - Renders the podcast grid and pagination once data is loaded.
 *
 * Context:
 * - Consumes `PodcastContext` to access podcast data, loading, and error states.
 *
 * @returns {JSX.Element} The home page content with filters, results, and feedback states.
 */
export default function Home() {
  const { podcasts, loading, error } = useContext(PodcastContext);

  // Safely take the first 5 podcasts to feature in the carousel
  const featuredPodcasts = Array.isArray(podcasts) ? podcasts.slice(0, 5) : [];

  return (
    <main className={styles.main}>
      {!loading && !error && featuredPodcasts.length > 0 && (
        <div className={styles.carouselContainer}>
          <Carousel>
            {featuredPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </Carousel>
        </div>
      )}
      
      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      {loading && <Loading message="Loading podcasts..." />}
      {error && (
        <Error message={`Error occurred while fetching podcasts: ${error}`} />
      )}

      {!loading && !error && (
        <>
          <PodcastGrid />
          <Pagination />
        </>
      )}
    </main>
  );
}
