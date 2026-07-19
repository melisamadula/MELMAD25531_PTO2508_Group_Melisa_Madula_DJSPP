import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PodcastDetail.module.css';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { formatDateTime } from '../../utils/formatDate';

const HeartFilled = () => (
  <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style={{ width: '22px', height: '22px', color: '#ff4b4b' }}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3c1.749 0 3.3 1.01 4.312 2.733C13.012 4.01 14.562 3 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

export default function FavoritesPage() {
  const { playTrack } = useAudioPlayer();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('podcast_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [sortOption, setSortOption] = useState('date_newest');
  const [loading, setLoading] = useState(false);

  const sortedFavorites = useMemo(() => {
    const items = [...favoriteEpisodes];

    switch (sortOption) {
      case 'title_asc':
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return items.sort((a, b) => b.title.localeCompare(a.title));
      case 'date_oldest':
        return items.sort((a, b) => new Date(a.dateAdded || 0) - new Date(b.dateAdded || 0));
      case 'date_newest':
      default:
        return items.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }
  }, [favoriteEpisodes, sortOption]);

  const groupedFavorites = useMemo(() => {
    return sortedFavorites.reduce((groups, episode) => {
      const showName = episode.showTitle || 'Unknown Show';
      if (!groups[showName]) groups[showName] = [];
      groups[showName].push(episode);
      return groups;
    }, {});
  }, [sortedFavorites]);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteEpisodes([]);
      return;
    }

    const loadFavoritesData = async () => {
      setLoading(true);
      try {
        // Collect valid showIds from objects (safely skips old flat string ids)
        const rawShowIds = favorites.map(fav => fav && typeof fav === 'object' ? fav.showId : null);
        const uniqueShowIds = [...new Set(rawShowIds.filter(Boolean))];

        if (uniqueShowIds.length === 0) {
          setFavoriteEpisodes([]);
          setLoading(false);
          return;
        }

        const fetchPromises = uniqueShowIds.map(async (id) => {
          const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
          if (!res.ok) throw new Error("API Route unavailable");
          return res.json();
        });
        const detailedShows = await Promise.all(fetchPromises);

        const matched = [];
        favorites.forEach((fav) => {
          if (!fav || typeof fav !== 'object') return;

          const parentShow = detailedShows.find((show) => show.id === fav.showId);
          if (!parentShow?.seasons) return;

          parentShow.seasons.forEach((season, seasonIndex) => {
            season.episodes.forEach((episode, epIndex) => {
              const candidateIds = [
                episode.id,
                episode.trackId,
                `${parentShow.id}-s${seasonIndex}-e${epIndex}`,
                `${parentShow.id}-${seasonIndex}-${epIndex}`,
                `${parentShow.id}-${episode.title}`,
              ].filter(Boolean);

              if (candidateIds.includes(fav.episodeId)) {
                matched.push({
                  ...episode,
                  id: fav.episodeId,
                  episodeId: fav.episodeId,
                  showTitle: parentShow.title,
                  seasonTitle: season.title,
                  seasonNumber: seasonIndex + 1,
                  episodeNumber: epIndex + 1,
                  seasonImage: season.image || parentShow.image,
                  dateAdded: fav.dateAdded,
                });
              }
            });
          });
        });

        setFavoriteEpisodes(matched);
      } catch (err) {
        console.error("Error matching fields against remote payload schema:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavoritesData();
  }, [favorites]);

  const removeFavorite = (episodeId) => {
    const updated = favorites.filter(fav => fav && fav.episodeId !== episodeId);
    setFavorites(updated);
    localStorage.setItem('podcast_favorites', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setFavorites([]);
    localStorage.removeItem('podcast_favorites');
  };

  if (loading) return <div className={styles.container}><h3>Loading your favorites...</h3></div>;

  if (favoriteEpisodes.length === 0) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>No favorites saved yet</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Your liked podcast episodes will show up here.</p>
        <Link to="/" className={styles.backButton}>← Go Explore Podcasts</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 className={styles.title} style={{ margin: 0 }}>Your Favourite Episodes</h1>

        <div className={styles.sortControls}>
          <label htmlFor="favorites-sort">Sort</label>
          <select
            id="favorites-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
            <option value="date_newest">Newest Added</option>
            <option value="date_oldest">Oldest Added</option>
          </select>
        </div>

        <button 
          onClick={handleClearAll}
          style={{ background: '#ff4b4b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Clear All
        </button>
      </div>
      
      <div className={styles.seasonDetails}>
        {Object.entries(groupedFavorites).map(([showTitle, episodes]) => (
          <section key={showTitle} className={styles.groupSection}>
            <h2 className={styles.groupHeading}>{showTitle}</h2>
            <div className={styles.episodeList}>
              {episodes.map((episode) => (
                <div key={`${episode.id}-${episode.seasonNumber}`} className={styles.episodeCard}>
                  <img className={styles.episodeCover} src={episode.seasonImage} alt="" />

                  <div className={styles.episodeInfo}>
                    <strong style={{ color: '#0070f3', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      {episode.showTitle}
                    </strong>
                    <p className={styles.favoriteMeta}>
                      S{episode.seasonNumber} · Ep{episode.episodeNumber ?? '—'}{episode.seasonTitle ? ` · ${episode.seasonTitle}` : ''}
                    </p>
                    <h4 className={styles.episodeTitle} style={{ marginTop: '4px' }}>
                      {episode.title}
                    </h4>
                    <p className={styles.episodeDesc}>{episode.description}</p>
                    <p className={styles.favoriteDate}>Added {formatDateTime(episode.dateAdded || new Date().toISOString())}</p>
                  </div>

                  <div className={styles.actionsContainer}>
                    <button
                      onClick={() => removeFavorite(episode.id)}
                      className={styles.favoriteButton}
                      aria-label="Remove from favorites"
                    >
                      <HeartFilled />
                    </button>

                    {episode.file && (
                      <button 
                        className={styles.playButton}
                        onClick={() => playTrack(episode.file, `${episode.showTitle} • ${episode.title}`)}
                        aria-label={`Play ${episode.title}`}
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
