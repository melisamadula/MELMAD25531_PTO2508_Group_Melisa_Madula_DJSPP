import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

// SVG Icons (Fixed XML Namespace strings)
const HeartEmpty = () => (
  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '22px', height: '22px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const HeartFilled = () => (
  <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style={{ width: '22px', height: '22px', color: '#ff4b4b' }}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.749 0 3.3 1.01 4.312 2.733C13.012 4.01 14.562 3 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

export default function PodcastDetail({ podcast, genres }) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();
  const { playTrack } = useAudioPlayer();

  // 1. Initialise favorites state from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('podcast_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Sync favorites state updates into localStorage
  useEffect(() => {
    localStorage.setItem('podcast_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setSelectedEpisodeIndex(0);
  }, [selectedSeasonIndex]);

  const handlePlayEpisode = (episode) => {
    if (episode?.file) {
      playTrack(episode.file, `${podcast.title} • ${episode.title}`);
    }
  };

  // 3. Toggle mechanism to add or remove an episode item object
  const toggleFavorite = (episodeId, event) => {
    event.stopPropagation(); // Prevents clicking the heart from changing the selected card state index
    
    setFavorites(prevFavorites => {
      // Check if this episode object is already saved inside our array
      const exists = prevFavorites.some(fav => fav.episodeId === episodeId);
      
      if (exists) {
        return prevFavorites.filter(fav => fav.episodeId !== episodeId);
      } else {
        // Correctly save BOTH IDs so the Favourites Page can find this specific episode easily
        return [...prevFavorites, {
          episodeId,
          showId: podcast.id,
          dateAdded: new Date().toISOString(),
        }];
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Header */}
      <div className={styles.header}>
        <img src={podcast.image} alt="Podcast Cover" className={styles.cover} />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <p className={styles.description}>{podcast.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.seasonInfo}>
              <div>
                <p>Genres</p>
                <GenreTags genres={genres} />
              </div>

              <div>
                <p>Last Updated:</p>
                <strong>{formatDate(podcast.updated)}</strong>
              </div>

              <div>
                <p>Total Seasons:</p>
                <strong>{podcast.seasons.length} Seasons</strong>
              </div>

              <div>
                <p>Total Episodes:</p>
                <strong>
                  {podcast.seasons.reduce(
                    (acc, s) => acc + s.episodes.length,
                    0
                  )}{" "}
                  Episodes
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Season Details */}
      <div className={styles.seasonDetails}>
        <div className={styles.seasonIntro}>
          <div className={styles.left}>
            <img className={styles.seasonCover} src={season.image} alt="" />
            <div>
              <h3>
                Season {selectedSeasonIndex + 1}: {season.title}
              </h3>
              <p>{season.description}</p>
              <p className={styles.releaseInfo}>
                {season.episodes.length} Episodes
              </p>
            </div>
          </div>
          <select
            value={selectedSeasonIndex}
            onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
            className={styles.dropdown}
          >
            {podcast.seasons.map((s, i) => (
              <option key={i} value={i}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Episode List Layout Row Configuration */}
        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => {
            // Generates a unique tracking key identification string safely
            const currentEpisodeId = ep.id || ep.trackId || `${podcast.id}-s${selectedSeasonIndex}-e${index}`;
            
            // FIXED PLACE: Correctly checking if the complex object array matches our current ID structure
            const isFavorited = favorites.some(fav => fav.episodeId === currentEpisodeId);

            return (
              <div
                key={index}
                className={styles.episodeCard}
                onClick={() => setSelectedEpisodeIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedEpisodeIndex(index);
                  }
                }}
              >
                <img className={styles.episodeCover} src={season.image} alt="" />
                
                <div className={styles.episodeInfo}>
                  <p className={styles.episodeTitle}>
                    Episode {index + 1}: {ep.title}
                  </p>
                  <p className={styles.episodeDesc}>{ep.description}</p>
                </div>

                {/* Right Side Stack Wrapper for Heart and Play Button placement alignment */}
                <div className={styles.actionsContainer}>
                  
                  {/* Heart Button Positioned Above Play Button */}
                  <button
                    type="button"
                    onClick={(event) => toggleFavorite(currentEpisodeId, event)}
                    className={styles.favoriteButton}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorited ? <HeartFilled /> : <HeartEmpty />}
                  </button>

                  {/* Audio Control Trigger Element */}
                  {ep.file && (
                    <button
                      className={styles.playButton}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePlayEpisode(ep);
                      }}
                      aria-label={`Play ${ep.title}`}
                    >
                      ▶
                    </button>
                  )}
                  
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
