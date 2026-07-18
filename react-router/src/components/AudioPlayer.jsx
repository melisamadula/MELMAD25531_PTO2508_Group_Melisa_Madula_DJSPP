import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAudioPlayer } from "../context/AudioPlayerContext";

function AppPlayer() {
  const { currentTrack, stopPlayer } = useAudioPlayer();

  if (!currentTrack?.src) return null;

  return (
    <div
      className="player-wrapper"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.9)",
        padding: "0.75rem 1rem",
        boxSizing: "border-box",
        borderTop: "1px solid rgba(255,255,255,0.12)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "0.35rem"
        }}
      >
        <div style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 600 }}>
          {currentTrack.title || "Now playing"}
        </div>
        <button
          type="button"
          onClick={stopPlayer}
          style={{
            border: "none",
            background: "transparent",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          Stop
        </button>
      </div>
      <AudioPlayer
        autoPlay={false}
        src={currentTrack.src}
        showSkipControls={false}
        layout="stacked-reverse"
        customAdditionalControls={[]}
        volume={0.8}
        onEnded={stopPlayer}
      />
    </div>
  );
}

export default AppPlayer;
