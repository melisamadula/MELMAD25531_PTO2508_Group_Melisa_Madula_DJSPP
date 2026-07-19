import { createContext, useContext, useState } from "react";

/**
 * @typedef {Object} TrackPayload
 * @property {string} src - The remote audio streaming media URL path.
 * @property {string} title - The display name string for the active podcast episode.
 */

/**
 * @typedef {Object} AudioContextValue
 * @property {TrackPayload|null} currentTrack - The active playing track object metadata, or null if idle.
 * @property {function(string, string): void} playTrack - Sets a new media resource source and kicks off audio playback.
 * @property {function(): void} stopPlayer - Clears the current tracking configuration state and halts player media loops.
 */

/** @type {React.Context<AudioContextValue|null>} */
const AudioPlayerContext = createContext(null);

/**
 * Context Provider component that wraps layout trees to supply audio streaming state and controls.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components that need access to the audio engine state.
 * @returns {JSX.Element} A context wrap element injecting the audio context runtime scope.
 */
export function AudioPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);

  const playTrack = (src, title) => {
    if (!src) {
      setCurrentTrack(null);
      return;
    }

    setCurrentTrack({ src, title });
  };

  const stopPlayer = () => {
    setCurrentTrack(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{ currentTrack, playTrack, stopPlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

/**
 * Custom React hook to safely consume the application media player state parameters.
 * Throws an explicit execution block error if called outside an active AudioPlayerProvider structure.
 *
 * @returns {AudioContextValue} The compiled active control parameters and media track properties.
 * @throws {Error} If consumed outside of a parent AudioPlayerProvider element context.
 */
export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }

  return context;
}
