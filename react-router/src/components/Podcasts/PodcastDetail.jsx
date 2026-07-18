import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

export default function PodcastDetail({ podcast, genres }) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    setSelectedEpisodeIndex(0);
  }, [selectedSeasonIndex]);

  const handlePlayEpisode = (episode) => {
    if (episode?.file) {
      playTrack(episode.file, `${podcast.title} • ${episode.title}`);
    }
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
            <img className={styles.seasonCover} src={season.image} />
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

        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => (
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
          ))}
        </div>

      </div>
    </div>
  );
}
